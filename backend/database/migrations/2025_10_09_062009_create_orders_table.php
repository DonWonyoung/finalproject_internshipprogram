<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    // Run the migrations.
    public function up(): void {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->bigInteger('total');
            $table->enum('payment_status', ['paid', 'not_paid', 'cod_pending'])->default('not_paid');
            $table->enum('status', ['pending', 'shipped', 'delivered', 'cancelled'])->default('pending');
            $table->string('name');
            $table->string('email');
            $table->string('mobile');
            $table->longText('address');
            $table->string('city');
            $table->string('state');
            $table->string('zip');
            $table->timestamps();
        });
    }

    // Reverse the migrations.
    public function down(): void {
        Schema::dropIfExists('orders');
    }
};