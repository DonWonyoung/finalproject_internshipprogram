<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model {
    protected $fillable = ['payment_status', 'status'];

    public function items() {
        return $this->hasMany(OrderItem::class);
    }

    protected function casts(): array {
        return [
            'created_at' => 'datetime: d F Y'
        ];
    }
}