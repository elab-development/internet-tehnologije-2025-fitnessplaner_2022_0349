<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Trening extends Model
{
    use HasFactory;

    protected $table = 'treninzi';

    protected $fillable = [
        'korisnik_id',
        'naziv',
        'trajanje_minuta',
        'tezina',
    ];

    public function korisnik(): BelongsTo
    {
        return $this->belongsTo(User::class, 'korisnik_id');
    }

    public function izvodjenja(): HasMany
    {
        return $this->hasMany(IzvodjenjeVezbe::class, 'trening_id')->orderBy('redosled');
    }
}
