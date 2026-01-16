<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Hidratacija extends Model
{
    use HasFactory;

    protected $table = 'hidratacije';

    protected $fillable = [
        'korisnik_id',
        'datum',
        'cilj_ml',
        'uneseno_ml',
    ];

    protected $casts = [
        'datum' => 'date',
    ];

    // Hidratacija pripada korisniku
    public function korisnik(): BelongsTo
    {
        return $this->belongsTo(User::class, 'korisnik_id');
    }
}
