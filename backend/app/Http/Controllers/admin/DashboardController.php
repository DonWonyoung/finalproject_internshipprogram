<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller {
    public function getCounts() {
        $monthlySales = Order::select(
            DB::raw('MONTH(created_at) as month'),
            DB::raw('SUM(total) as total_sales')
        )->where('payment_status', 'paid')
        ->whereYear('created_at', now()->year)
        ->groupBy(DB::raw('MONTH(created_at)'))
        ->orderBy('month')->get();

        $counts = [
            'users' => User::where('role', 'customer')->count(),
            'orders' => Order::count(),
            'products' => Product::count(),
            'monthly_sales' => $monthlySales
        ];

        return response()->json([
            'status' => 200,
            'data' => $counts,
        ]);
    }
}