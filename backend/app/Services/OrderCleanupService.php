<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderCleanupService {
    public static function cancelExpiredOrders(): void {
        Log::info('Cleanup started at '.now());

        Order::where('status', 'pending')
        ->where('payment_status', 'not_paid')
        ->whereNotNull('expires_at')
        ->where('expires_at', '<=', now())
        ->with('items')
        ->get()
        ->each(function ($order) {

            DB::transaction(function () use ($order) {
                // Double-check langsung dari DB tanpa merusak relasi
                if (!Order::where('id', $order->id)
                ->where('status','pending')->exists()) {
                    return;
                }

                Log::info('Cancelling order '.$order->id);

                foreach ($order->items as $item) {
                    Log::info("Restoring product {$item->product_id}");
                    Product::where('id', $item->product_id)
                    ->increment('quantity', $item->quantity);
                }

                $order->update([
                    'status' => 'cancelled',
                    'payment_status' => 'expired'
                ]);
            });
        });
    }
}