<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Promo;
use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Encoding\Encoding;
use Illuminate\Http\Request;
use Endroid\QrCode\Writer\PngWriter;
use Endroid\QrCode\ErrorCorrectionLevel;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Stripe\Checkout\Session;
use Stripe\Stripe;

class OrderController extends Controller {
    public function saveOrder(Request $request) {
        if (empty($request->cart)) {
            return response()->json([
                'status' => 400,
                'message' => 'Keranjang Anda kosong.'
            ], 400);
        }

        // Validasi metode pembayaran
        if (!in_array($request->payment_method, ['qris', 'cod', 'credit_card'])) {
            return response()->json([
                'status' => 400,
                'message' => 'Metode pembayaran tidak valid.'
            ], 400);
        }

        DB::beginTransaction();

        try {
            // 1️⃣ VALIDASI STOK SEMUA ITEM
            foreach ($request->cart as $item) {
                $product = Product::lockForUpdate()->find($item['product_id']);

                if (!$product) {
                    DB::rollBack();
                    return response()->json([
                        'status' => 404,
                        'message' => 'Produk tidak ditemukan.'
                    ], 404);
                }

                if ($product->quantity < $item['quantity']) {
                    DB::rollBack();
                    return response()->json([
                        'status' => 400,
                        'message' => "Stok {$product->title} tidak mencukupi. Sisa: {$product->quantity}"
                    ], 400);
                }
            }

            $total = 0;
            $discount = 0;

            foreach ($request->cart as $item) {
                $product = Product::find($item['product_id']);
                $total += $product->price * $item['quantity'];
            }

            if($request->promo_code) {
                $promo = Promo::where('code', strtoupper(trim($request->promo_code)))->where('is_active', 1)->first();

                if ($promo) {
                    // cek expired
                    if ($promo->expires_at && now()->gt($promo->expires_at)) {
                        return response()->json([
                            'status' => 400,
                            'message' => 'Kode promo sudah kedaluwarsa.'
                        ], 400);
                    }

                    // minimum belanja
                    if ($total < $promo->min_purchase) {
                        return response()->json([
                            'status' => 400,
                            'message' => 'Minimum pembelian Rp. '.number_format($promo->min_purchase)
                        ], 400);
                    }

                    // hitung diskon
                    if ($promo->discount_type === 'percent'
                    ) {
                        $discount = ($total * $promo->discount_value) / 100;
                    } else {
                        $discount = $promo->discount_value;
                    }
                }
            }

            // 2️⃣ SIMPAN ORDER
            $order = new Order();
            $order->name = $request->name;
            $order->email = $request->email;
            $order->address = $request->address;
            $order->mobile = $request->mobile;
            $order->city = $request->city;
            $order->state = $request->state;
            $order->zip = $request->zip;
            $order->subtotal = $total;
            $order->discount = $discount;
            $order->total = max(0, $total - $discount);
            $order->promo_code = $request->promo_code;
            $order->payment_method = $request->payment_method;
            $order->payment_token = Str::random(64);
            $order->status = 'pending';
            $order->user_id = $request->user()->id;

            // Status pembayaran ditentukan backend
            if ($request->payment_method === 'qris') {
                $order->payment_status = 'not_paid';
                $order->expires_at = now()->addHour();
            }
            else if ($request->payment_method === 'credit_card') {
                $order->payment_status = 'not_paid';
                $order->expires_at = null;
            }
            else {
                $order->payment_status = 'cod_pending';
                $order->expires_at = null;
            }

            $order->save();

            if($request->payment_method === 'credit_card') {

                Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

                $session = Session::create([
                    'payment_method_types' => ['card'],
                    'line_items' => [[
                        'price_data' => [
                            'currency' => 'idr',
                            'product_data' => [
                                'name' => 'Order #' . $order->id
                            ],
                            'unit_amount' => $order->total * 100
                        ],
                        'quantity' => 1
                    ]],

                    'mode' => 'payment',
                    'success_url' => env('FRONTEND_URL').'/order/confirmation/'.$order->id.'/'.$order->payment_token,
                    'cancel_url' => env('FRONTEND_URL').'/checkout'
                ]);
            }

            // 3️⃣ SIMPAN ITEM & KURANGI STOK
            foreach ($request->cart as $item) {
                $product = Product::lockForUpdate()->find($item['product_id']);

                // Kurangi stok
                $product->quantity -= $item['quantity'];
                $product->save();

                // Simpan item
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['price'],
                    'price' => $item['quantity'] * $item['price'],
                    'name' => $item['title']
                ]);
            }

            DB::commit();

            return response()->json([
                'status' => 200,
                'id' => $order->id,
                'payment_token' => $order->payment_token,
                'checkout_url' => $session->url ?? null,
                'message' => 'Pesanan berhasil dibuat.'
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => 500,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function generateQrCode($id, $token) {
        $order = Order::where('id', $id)
        ->where('user_id', auth()->id())
        ->where('payment_token', $token)
        ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Pesanan tidak ditemukan.'
            ], 404);
        }

        // ❌ COD tidak boleh punya QR
        if ($order->payment_method !== 'qris') {
            return response()->json([
                'success' => false,
                'message' => 'QR hanya tersedia untuk pembayaran QRIS.'
            ], 403);
        }

        // ❌ Sudah dibayar tidak perlu QR
        if ($order->payment_status === 'paid') {
            return response()->json([
                'success' => false,
                'message' => 'Pesanan ini sudah dibayar.'
            ], 400);
        }

        try {
            $data = url('/payment/confirm/'.$order->id.'/'.$order->payment_token);

            $result = Builder::create()
                ->writer(new PngWriter())
                ->data($data)
                ->encoding(new Encoding('UTF-8'))
                ->errorCorrectionLevel(ErrorCorrectionLevel::High)
                ->size(250)
                ->margin(10)
                ->build();

            $qrBase64 = base64_encode($result->getString());

            return response()->json([
                'success' => true,
                'qr_code' => 'data:image/png;base64,' . $qrBase64,
                'order' => $order
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat QR.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateOrder(Request $request, $id) {
        // Pastikan admin
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'status' => 403,
                'message' => 'Akses ditolak.'
            ], 403);
        }

        $order = Order::with('items')->find($id);

        if (!$order) {
            return response()->json([
                'status' => 404,
                'message' => 'Pesanan tidak ditemukan.'
            ], 404);
        }

        $order->status = $request->status;
        $order->payment_status = $request->payment_status;
        $order->save();

        return response()->json([
            'status' => 200,
            'data' => $order,
            'message' => 'Pesanan berhasil diperbarui.'
        ]);
    }

    public function markAsPaid($id, $token) {
        $order = Order::find($id)->where('payment_token', $token)->first();

        if (!$order || $order->payment_method !== 'qris') {
            return response()->json([
                'success' => false,
                'message' => 'Order tidak valid.'
            ], 400);
        }

        $order->payment_status = 'paid';
        $order->save();

        return response()->json([
            'success' => true,
            'message' => 'Pembayaran berhasil dikonfirmasi.'
        ]);
    }
}