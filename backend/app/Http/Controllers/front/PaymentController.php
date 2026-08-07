<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Order;

class PaymentController extends Controller {
    public function confirm($id, $token) {
        $order = Order::find($id);

        if (!$order) abort(404);

        if ($order->payment_method !== 'qris') abort(403);

        if ($order->payment_token !== $token) abort(403);

        return view('payment.confirm', compact('order'));
    }
}