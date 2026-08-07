<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use App\Models\Review;
use App\Models\Subcategory;

class ProductController extends Controller {
    public function getProducts(Request $request) {
        $products = Product::orderBy('created_at', 'DESC')->where('status', 1);
        
        // Filter product by category
        if(!empty($request->category)) {
            $categoryArray = explode(',', $request->category);
            $products = $products->whereIn('category_id', $categoryArray);
        }

        // Filter product by subcategory
        if(!empty($request->subcategory)) {
            $subcategoryArray = explode(',', $request->subcategory);
            $products = $products->whereIn('subcategory_id', $subcategoryArray);
        }

        if(!empty($request->keyword)) {
            $keyword = $request->query('keyword');
            $products = $products->where('title', 'like', "%{$keyword}%");
        }

        $products = $products->get();

        return response()->json([
            'status' => 200,
            'data' => $products
        ], 200);
    }

    public function latestProducts() {
        $products = Product::orderBy('created_at', 'DESC')->where('status', 1)->limit(8)->get();

        return response()->json([
            'status' => 200,
            'data' => $products
        ], 200);
    }

    public function featuredProducts() {
        $products = Product::orderBy('created_at', 'DESC')->where('status', 1)->where('is_featured', 'yes')->limit(8)->get();

        return response()->json([
            'status' => 200,
            'data' => $products
        ], 200);
    }

    public function getCategories() {
        $categories = Category::orderBy('name', 'ASC')->where('status', 1)->get();

        return response()->json([
            'status' => 200,
            'data' => $categories
        ], 200);
    }

    public function getSubcategories() {
        $subcategories = Subcategory::orderBy('name', 'ASC')->where('status', 1)->get();

        return response()->json([
            'status' => 200,
            'data' => $subcategories
        ], 200);
    }

    public function getProduct($id) {
        $product = Product::with('product_images')->find($id);

        if($product == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Produk tidak ditemukan.'
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => $product
        ], 200);
    }
}