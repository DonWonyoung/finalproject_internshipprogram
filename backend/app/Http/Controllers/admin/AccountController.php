<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AccountController extends Controller {
    public function changePassword(Request $request) {
        $user = $request->user();

        // Pastikan hanya role 'admin' yang bisa ganti password
        if ($user->role !== 'admin') {
            return response()->json([
                'status' => 401,
                'message' => 'Hanya admin yang bisa mengubah kata sandi.'
            ], 401);
        }

        // Validasi input
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed', // Harus ada new_password_confirmation di request
        ]);

        // Cek apakah password lama benar
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'status' => 400,
                'message' => 'Kata sandi tidak sesuai.'
            ], 400);
        }

        // Update password
        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json([
            'status' => 200,
            'message' => 'Berhasil mengubah kata sandi.'
        ], 200);
    }
}
