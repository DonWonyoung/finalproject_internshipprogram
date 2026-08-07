<?php

use App\Http\Controllers\front\GoogleAuthController;
use App\Http\Controllers\front\PaymentController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Google OAuth
Route::get('/auth/google', [GoogleAuthController::class, 'redirect']);
Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback']);

Route::get('/payment/confirm/{id}/{token}', [PaymentController::class, 'confirm']);