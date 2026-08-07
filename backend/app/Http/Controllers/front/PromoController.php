<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Promo;
use Illuminate\Http\Request;

class PromoController extends Controller {
    public function index() {
        $promos = Promo::all()->map(function ($promo) {
            return [
                'id' => $promo->id,
                'name' => $promo->name,
                'image_url' => 'storage/'.$promo->image,
                'description' => $promo->description
            ];
        });

        return response()->json($promos);
    }

    public function applyPromo(Request $request) {
        $promo = Promo::where('code', strtoupper(trim($request->code)))->where('is_active', 1)->first();

        if (!$promo) {
            return response()->json([
                'status' => 400,
                'message' => 'Kode promo tidak valid.'
            ]);
        }

        // expired
        if ($promo->expires_at && now()->gt($promo->expires_at)) {
            return response()->json([
                'status' => 400,
                'message' => 'Kode promo sudah kedaluwarsa.'
            ]);
        }

        $subtotal = (int) $request->subtotal;

        // minimum purchase
        if ($subtotal < $promo->min_purchase) {
            return response()->json([
                'status' => 400,
                'message' => 'Minimal belanja Rp. '.number_format($promo->min_purchase)
            ]);
        }

        // calculate discount
        if ($promo->discount_type === 'percent') {
            $discount = ($subtotal * $promo->discount_value) / 100;
        } else {
            $discount = $promo->discount_value;
        }

        return response()->json([
            'status' => 200,
            'discount' => (int) $discount,
            'message' => 'Promo berhasil digunakan.'
        ]);
    }
}