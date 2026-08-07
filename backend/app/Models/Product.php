<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\ProductImage;
use App\Models\Review;

class Product extends Model {
    protected $appends = ['image_url'];

    public function getImageUrlAttribute() {
        if (empty($this->image)) return '';

        return asset('uploads/products/small/'.$this->image);
    }

    function product_images() {
        return $this->hasMany(ProductImage::class);
    }

    function reviews() {
        return $this->hasMany(Review::class);
    }
}