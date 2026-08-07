<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\User;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller {
    public function redirect() {
        return Socialite::driver('google')->redirect();
    }

    public function callback() {
        $googleUser = Socialite::driver('google')->user();

        $user = User::where('email', $googleUser->getEmail())->first();

        if (!$user) {
            // user baru → pakai nama dari Google
            $user = User::create([
                'name' => $googleUser->getName(),
                'email' => $googleUser->getEmail(),
                'password' => bcrypt(str()->random(16)),
                'email_verified_at' => now()
            ]);
        }
        // kalau user sudah ada → JANGAN sentuh kolom name

        $token = $user->createToken('apitoken')->plainTextToken;

        return redirect(env('FRONTEND_URL')."/customer/login"."?token={$token}"."&id={$user->id}"."&name=".urlencode($user->name)."&verified=".($user->email_verified_at ? 1 : 0));
    }
}