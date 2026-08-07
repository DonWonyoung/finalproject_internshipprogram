<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class PasswordResetController extends Controller {
    public function forgetPassword(Request $request) {
        $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink($request->only('email'));

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json([
                'status' => 200,
                'message' => 'Jika email terdaftar, link reset sudah dikirim.'
            ]);
        }

        if ($status === Password::RESET_THROTTLED) {
            return response()->json([
                'status' => 429,
                'message' => 'Tunggu beberapa saat sebelum mengirim ulang link reset lagi.'
            ], 429);
        }

        // INVALID_USER atau lainnya → tetap respon sukses demi security
        return response()->json([
            'status' => 200,
            'message' => 'Jika email terdaftar, link reset sudah dikirim.'
        ]);
    }

    public function resetPassword(Request $request) {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required',
            'password' => 'required|min:8|confirmed'
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill(['password' => Hash::make($password)])->setRememberToken(Str::random(60));

                $user->save();
            }
        );

        if($status === Password::PASSWORD_RESET) {
            return response()->json([
                'status' => 200,
                'message' => 'Berhasil mereset kata sandi.'
            ], 200);
        } else {
            return response()->json([
                'status' => 400,
                'message' => 'Token tidak valid atau kedaluarsa.'
            ], 400);
        }
    }
}