<?php

namespace App\Console\Commands;

use App\Services\OrderCleanupService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class CancelExpiredOrders extends Command {
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'orders:cancel-expired';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cancel expired QRIS orders and restore product stock';

    // Execute the console command.
    public function handle() {
        Log::info('Running orders:cancel-expired at '.now());
        OrderCleanupService::cancelExpiredOrders();
        $this->info('Expired orders cancelled successfully.');
    }
}