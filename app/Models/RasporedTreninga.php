<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RasporedTreninga extends Model
{
    use HasFactory;

    protected $table = 'rasporedi_treninga';

    protected $fillable = [
        'korisnik_id',
        'trening_id',
        'datum',
        'status', // planirano | odradjeno | preskoceno
    ];

    protected $casts = [
        'datum' => 'date',
    ];

    public function korisnik(): BelongsTo
    {
        return $this->belongsTo(User::class, 'korisnik_id');
    }

    public function trening(): BelongsTo
    {
        return $this->belongsTo(Trening::class, 'trening_id');
    }
}
