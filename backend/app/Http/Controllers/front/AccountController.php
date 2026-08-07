<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AccountController extends Controller {
    public function register(Request $request) {
        // Validasi input
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        // Buat user baru
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'customer',
        ]);

        // Kirim email verifikasi
        try {
            $user->sendEmailVerificationNotification();
            Log::info('Link verifikasi email dikirim ke: ' . $user->email);
        } catch (\Exception $e) {
            Log::error('Gagal mengirimkan link verifikasi email: ' . $e->getMessage());
        }

        return response()->json([
            'status' => 200,
            'message' => 'Berhasil membuat akun! Silakan periksa email Anda untuk verifikasi akun.'
        ], 200);
    }

    public function authenticate(Request $request) {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        if(Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $user = Auth::user();

            if (is_null($user->email_verified_at)) {
                Auth::logout();

                return response()->json([
                    'status' => 403,
                    'message' => 'Email belum diverifikasi. Silakan cek email Anda.'
                ], 403);
            }

            if($user->role !== 'customer') {
                Auth::logout();

                return response()->json([
                    'status' => 401,
                    'message' => 'Anda tidak diizinkan untuk mengakses panel customer.'
                ], 401);
            }

            $token = $user->createToken('token')->plainTextToken;

            return response()->json([
                'status' => 200,
                'token' => $token,
                'id' => $user->id,
                'name' => $user->name,
                'email_verified_at' => $user->email_verified_at
            ], 200);
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'Email atau kata sandi salah.'
            ], 401);
        }
    }

    public function resendVerification(Request $request) {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();

        // Sudah verified?
        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'status' => 400,
                'message' => 'Email sudah diverifikasi.'
            ], 400);
        }

        try {
            $user->sendEmailVerificationNotification();

            return response()->json([
                'status' => 200,
                'message' => 'Link verifikasi email sudah dikirim ulang.'
            ], 200);

        } catch (\Exception $e) {
            Log::error('Resend verification gagal: '.$e->getMessage());

            return response()->json([
                'status' => 500,
                'message' => 'Gagal mengirim email verifikasi.'
            ], 500);
        }
    }

    public function getOrderDetails($id, Request $request) {
        $order = Order::where([
            'user_id' => $request->user()->id,
            'id' => $id
        ])->with('items', 'items.product')->first();

        if($order == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Pesanan tidak ditemukan.',
                'data' => []
            ], 404);
        } else {
            return response()->json([
                'status' => 200,
                'data' => $order
            ], 200);
        }
    }

    public function getOrders(Request $request) {
        $orders = Order::where('user_id', $request->user()->id)->get();

        return response()->json([
            'status' => 200,
            'data' => $orders
        ], 200);
    }

    public function updateProfile(Request $request) {
        $user = User::find($request->user()->id);

        if($user == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Pengguna tidak ditemukan.',
                'data' => []
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required|email|unique:users,email,'.$request->user()->id
        ]);

        if($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $user->name = $request->name;
        $user->email = $request->email;
        $user->city = $request->city;
        $user->state = $request->state;
        $user->zip = $request->zip;
        $user->mobile = $request->mobile;
        $user->address = $request->address;
        $user->save();

        return response()->json([
            'status' => 200,
            'message' => 'Berhasil memperbarui profil.',
            'data' => $user
        ], 200);
    }

    public function getProfileDetails(Request $request) {
        $user = User::find($request->user()->id);

        if($user == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Pengguna tidak ditemukan.',
                'data' => []
            ], 404);
        } else {
            return response()->json([
                'status' => 200,
                'data' => $user
            ], 200);
        }
    }

    public function changePassword(Request $request) {
        $user = $request->user();

        // Pastikan hanya role 'customer' yang bisa ganti password
        if ($user->role !== 'customer') {
            return response()->json([
                'status' => 401,
                'message' => 'Hanya customer yang bisa mengubah kata sandi.'
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