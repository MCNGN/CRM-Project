<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'invoice',
        'contact_id',
        'amount',
    ];

    protected $appends = ['name'];

    protected $hidden = ['contact'];

    public function contact()
    {
        return $this->belongsTo(Contact::class);
    }

    public function getNameAttribute()
    {
        return $this->contact->name;
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($sale) {
            $latestSale = Sale::latest('id')->first();
            $nextInvoiceNumber = $latestSale ? intval(substr($latestSale->invoice, 4)) + 1 : 1;
            $sale->invoice = 'INV-' . str_pad($nextInvoiceNumber, 5, '0', STR_PAD_LEFT);
        });
    }
}