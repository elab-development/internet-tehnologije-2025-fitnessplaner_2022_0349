<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DnevnikIshrane extends Model
{
    use HasFactory;

    protected $table = 'dnevnici_ishrane';

    protected $fillable = [
        'korisnik_id',
        'datum',
    ];

    protected $casts = [
        'datum' => 'date',
    ];

    // Dnevnik pripada jednom korisniku
    public function korisnik(): BelongsTo
    {
        return $this->belongsTo(User::class, 'korisnik_id');
    }

    // Dnevnik ima više stavki (namirnica + količina)
    public function stavke(): HasMany
    {
        return $this->hasMany(StavkaIshrane::class, 'dnevnik_ishrane_id');
    }
}
