<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\TempImage;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\File;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ProductController extends Controller {
    public function index() {
        $products = Product::orderBy('created_at', 'ASC')->with('product_images')->get();
        return response()->json([
            'status' => 200,
            'data' => $products
        ], 200);
    }

    public function store(Request $request) {
        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'price' => 'required|integer',
            'category' => 'required|integer',
            'sku' => 'required|unique:products,sku',
            'is_featured' => 'required',
            'status' => 'required'
        ]);

        if($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $product = new Product();
        $product->title = $request->title;
        $product->price = $request->price;
        $product->category_id = $request->category;
        $product->subcategory_id = $request->subcategory;
        $product->sku = $request->sku;
        $product->barcode = $request->barcode;
        $product->quantity = $request->quantity;
        $product->description = $request->description;
        $product->short_description = $request->short_description;
        $product->status = $request->status;
        $product->is_featured = $request->is_featured;
        $product->save();

        // Save product images
        if(!empty($request->gallery)) {
            foreach($request->gallery as $key => $tempImageId) {
                $tempImage = TempImage::find($tempImageId);

                // Large thumbnail
                $extArray = explode('.', $tempImage->name);
                $ext = end($extArray);
                $imageName = $product->id.'-'.time().'.'.$ext;
                $manager = new ImageManager(Driver::class);
                $img = $manager->read(public_path('uploads/temp/'.$tempImage->name));
                $img->scaleDown(1200);
                $img->save(public_path('uploads/products/large/'.$imageName));

                // Small thumbnail
                $manager = new ImageManager(Driver::class);
                $img = $manager->read(public_path('uploads/temp/' . $tempImage->name));
                $img->coverDown(400, 600);
                $img->save(public_path('uploads/products/small/' . $imageName));

                $productImage = new ProductImage();
                $productImage->image = $imageName;
                $productImage->product_id = $product->id;
                $productImage->save();

                if($key == 0) {
                    $product->image = $imageName;
                    $product->save();
                }
            }
        }

        return response()->json([
            'status' => 200,
            'message' => 'Berhasil membuat produk.'
        ]);
    }

    public function show($id) {
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

    public function update($id, Request $request) {
        $product = Product::find($id);

        if($product == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Produk tidak ditemukan.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'price' => 'required|numeric',
            'category' => 'required|integer',
            'sku' => 'required|unique:products,sku,'.$id.',id',
            'is_featured' => 'required',
            'status' => 'required'
        ]);

        if($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->messages()
            ], 400);
        }

        $product->title = $request->title;
        $product->price = $request->price;
        $product->category_id = $request->category;
        $product->subcategory_id = $request->subcategory;
        $product->sku = $request->sku;
        $product->barcode = $request->barcode;
        $product->quantity = $request->quantity;
        $product->description = $request->description;
        $product->short_description = $request->short_description;
        $product->status = $request->status;
        $product->is_featured = $request->is_featured;
        $product->save();

        return response()->json([
            'status' => 200,
            'message' => 'Berhasil memperbarui produk.'
        ]);
    }

    public function destroy($id) {
        $product = Product::with('product_images')->find($id);

        if($product == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Pesanan tidak ditemukan.'
            ], 404);
        }

        $product->delete();

        if($product->product_images()) {
            foreach($product->product_images() as $productImage) {
                File::delete(public_path('uploads/products/large/'.$productImage->image));
                File::delete(public_path('uploads/products/small/'.$productImage->image));
            }
        }

        return response()->json([
            'status' => 200,
            'message' => 'Berhasil menghapus produk.'
        ], 200);
    }

    public function saveProductImage(Request $request) {
        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg'
        ]);

        if($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $image = $request->file('image');
        $imageName = $request->product_id.'-'.time().'.'.$image->extension();

        // Large thumbnail
        $manager = new ImageManager(Driver::class);
        $img = $manager->read($image->getPathName());
        $img->scaleDown(1200);
        $img->save(public_path('uploads/products/large/'.$imageName));

        // Small thumbnail
        $manager = new ImageManager(Driver::class);
        $img = $manager->read($image->getPathName());
        $img->coverDown(400, 600);
        $img->save(public_path('uploads/products/small/' . $imageName));

        // Insert a record in product_images table
        $productImage = new ProductImage();
        $productImage->image = $imageName;
        $productImage->product_id = $request->product_id;
        $productImage->save();

        return response()->json([
            'status' => 200,
            'message' => 'Berhasil mengupload gambar.',
            'data' => $productImage
        ], 200);
    }

    public function updateDefaultImage(Request $request) {
        $product = Product::find($request->product_id);
        $product->image = $request->image;
        $product->save();

        return response()->json([
            'status' => 200,
            'message' => 'Berhasil mengubah gambar default.'
        ], 200);
    }

    public function deleteProductImage($id) {
        $productImage = ProductImage::find($id);
        
        if($productImage == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Gambar tidak ditemukan.'
            ], 200);
        }

        File::delete(public_path('uploads/products/large/'.$productImage->image));
        File::delete(public_path('uploads/products/small/'.$productImage->image));
        $productImage->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Berhasil menghapus gambar produk.'
        ], 200);
    }
}