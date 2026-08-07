<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\User;

class UserController extends Controller {
    public function showUsers() {
        $users = User::orderBy('created_at', 'ASC')->where('role', 'customer')->get();
        return response()->json([
            'status' => 200,
            'data' => $users
        ], 200);
    }

    public function deleteUser($id) {
        $user = User::where('id', $id)->where('role', 'customer')->first();

        if(!$user) {
            return response()->json([
                'status' => 404,
                'message' => 'Pengguna tidak ditemukan.'
            ], 404);
        }

        $user->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Berhasil menghapus pengguna.'
        ], 200);
    }
}