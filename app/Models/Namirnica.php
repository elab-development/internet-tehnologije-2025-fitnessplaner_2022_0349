<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Namirnica extends Model
{
    use HasFactory;

    protected $table = 'namirnice';

    protected $fillable = [
        'naziv',
        'kalorije_na_100g',
        'proteini_na_100g',
        'ugljeni_hidrati_na_100g',
        'masti_na_100g',
    ];

    // Jedna namirnica se može pojaviti u mnogo stavki ishrane
    public function stavke(): HasMany
    {
        return $this->hasMany(StavkaIshrane::class, 'namirnica_id');
    }
}
