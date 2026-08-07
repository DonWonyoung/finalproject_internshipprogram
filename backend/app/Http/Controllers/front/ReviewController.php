<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller {
    public function addReview(Request $request) {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'description' => 'required|string|max:2000'
        ]);

        $review = Review::create([
            'product_id' => $request->product_id,
            'user_id' => $request->user()->id,
            'rating' => $request->rating,
            'description' => $request->description
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Berhasil menambahkan ulasan.',
            'data' => $review
        ], 200);
    }

    public function getReviews($id) {
        $reviews = Review::with('user')
            ->where('product_id', $id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $reviews
        ], 200);
    }

    public function updateReview(Request $request, $id) {
        $review = Review::where('id', $id)
            ->where('user_id', $request->user()->id) // pastikan hanya user pemilik ulasan
            ->first();

        if (!$review) {
            return response()->json([
                'status' => 403,
                'message' => 'Anda tidak diizinkan untuk mengedit ulasan ini.'
            ], 403);
        }

        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'description' => 'required|string|max:2000'
        ]);

        $review->update([
            'rating' => $request->rating,
            'description' => $request->description,
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Berhasil mengedit ulasan.'
        ], 200);
    }

    public function deleteReview(Request $request, $id) {
        $review = Review::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$review) {
            return response()->json([
                'status' => 404,
                'message' => 'Ulasan tidak ditemukan.'
            ], 404);
        }

        $review->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Berhasil menghapus ulasan.'
        ], 200);
    }
}