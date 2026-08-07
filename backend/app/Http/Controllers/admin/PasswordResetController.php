<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class PasswordResetController extends Controller {
    public function forgetPassword(Request $request) {
        $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink($request->only('email'));

        return $status === Password::RESET_LINK_SENT ?
        response()->json([
            'status' => 200,
            'message' => __($status)
        ], 200) :
        response()->json([
            'status' => 400,
            'message' => __($status)
        ], 400);
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

        return $status === Password::PASSWORD_RESET ?
        response()->json([
            'status' => 200,
            'message' => 'Berhasil mereset kata sandi.'
        ], 200) :
        response()->json([
            'status' => 400,
            'message' => 'Token tidak valid atau kedaluarsa.'
        ], 400);
    }
}