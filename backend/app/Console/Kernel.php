<?php

namespace App\Console;

use App\Console\Commands\CancelExpiredOrders;
use App\Services\OrderCleanupService;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\Log;

class Kernel extends ConsoleKernel {
    // Register Artisan commands
    protected $commands = [CancelExpiredOrders::class];

    // Define the application's command schedule
    protected function schedule(Schedule $schedule): void {
        $schedule->command('orders:cancel-expired')
        ->everyMinute()
        ->withoutOverlapping()
        ->runInBackground();
    }

    // Register the commands for the application
    protected function commands(): void {
        $this->load(__DIR__.'/Commands');
    }
}