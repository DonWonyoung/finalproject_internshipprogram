<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Services\OrderCleanupService;
use Illuminate\Http\Request;

class OrderController extends Controller {
    public function index() {
        // 🔥 AUTO CLEANUP ORDER EXPIRED
        OrderCleanupService::cancelExpiredOrders();

        $orders = Order::orderBy('created_at', 'ASC')->get();

        return response()->json([
            'data' => $orders,
            'status' => 200
        ], 200);
    }

    public function detail($id) {
        $order = Order::with('items', 'items.product')->find($id);

        if($order == null) {
            response()->json([
                'data' => [],
                'message' => 'Pesanan tidak ditemukan.',
                'status' => 404
            ], 404);
        }

        return response()->json([
            'data' => $order,
            'status' => 200
        ], 200);
    }

    public function update($id, Request $request) {
        $order = Order::find($id);

        if (!$order) {
            return response()->json([
                'status' => 404,
                'message' => 'Pesanan tidak ditemukan.'
            ], 404);
        }

        // Admin boleh ubah order status (shipping / lifecycle)
        if ($request->has('status')) {
            if ($request->status === 'cancelled' && $order->status !== 'cancelled') {
                foreach ($order->items as $item) {
                    $product = Product::find($item->product_id);
                    $product->quantity += $item->quantity;
                    $product->save();
                }
            }

            $order->status = $request->status;
        }

        /**
         * RULE PEMBAYARAN
         */

        if ($order->payment_method === 'cod') {
            // COD hanya boleh jadi paid kalau sudah delivered
            if ($request->status === 'delivered' && $order->payment_status === 'cod_pending') {
                $order->payment_status = 'paid';
            }
        }

        // QRIS boleh diubah manual admin
        if ($order->payment_method === 'qris' || $order->payment_method === 'credit_card') {
            if ($request->has('payment_status')) {
                $order->payment_status = $request->payment_status;
            }
        }

        $order->save();

        return response()->json([
            'status' => 200,
            'data' => $order,
            'message' => 'Pesanan berhasil diperbarui.'
        ]);
    }
}