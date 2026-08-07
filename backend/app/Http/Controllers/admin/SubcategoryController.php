<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Subcategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SubcategoryController extends Controller {
    public function index() {
        $subcategories = Subcategory::orderBy('created_at', 'ASC')->get();
        return response()->json([
            'status' => 200,
            'data' => $subcategories
        ]);
    }

    public function store(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'status' => 'required'
        ]);

        if($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $subcategory = new Subcategory();
        $subcategory->name = $request->name;
        $subcategory->status = $request->status;
        $subcategory->save();

        return response()->json([
            'status' => 200,
            'message' => 'Berhasil menambahkan subkategori.',
            'data' => $subcategory
        ], 200);
    }

    public function show($id) {
        $subcategory = Subcategory::find($id);

        if($subcategory == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Subkategori tidak ditemukan.',
                'data' => []
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => $subcategory
        ]);
    }

    public function update($id, Request $request) {
        $subcategory = Subcategory::find($id);

        if($subcategory == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Subkategori tidak ditemukan.',
                'data' => []
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required'
        ]);

        if($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $subcategory->name = $request->name;
        $subcategory->status = $request->status;
        $subcategory->save();

        return response()->json([
            'status' => 200,
            'message' => 'Berhasil memperbarui subkategori.',
            'data' => $subcategory
        ], 200);
    }

    public function destroy($id) {
        $subcategory = Subcategory::find($id);

        if($subcategory == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Subkategori tidak ditemukan.',
                'data' => []
            ], 404);
        }

        $subcategory->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Berhasil menghapus subkategori.'
        ], 200);
    }
}