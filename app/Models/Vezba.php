<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vezba extends Model
{
    use HasFactory;
    
    // (1) Eksplicitno kažemo tabelu 
    protected $table = 'vezbe';

    // (2) Polja koja smeju da se masovno upisuju (create/update)
    protected $fillable = [
        'naziv',
        'opis',
        'misicna_grupa',
        'oprema',
        'video_url',
    ];

    // (3) Relacija: jedna vezba se pojavljuje u više izvođenja vežbe
    public function izvodjenja(): HasMany
    {
        return $this->hasMany(IzvodjenjeVezbe::class, 'vezba_id');
    }
}
