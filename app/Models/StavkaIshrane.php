<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StavkaIshrane extends Model
{
    use HasFactory;

    protected $table = 'stavke_ishrane';

    protected $fillable = [
        'dnevnik_ishrane_id',
        'namirnica_id',
        'kolicina_g',
        'obrok',   // dorucak/rucak/vecera/uzina (opciono)
        'vreme',   // HH:MM:SS (opciono)
    ];

    // Stavka pripada jednom dnevniku
    public function dnevnik(): BelongsTo
    {
        return $this->belongsTo(DnevnikIshrane::class, 'dnevnik_ishrane_id');
    }

    // Stavka pripada jednoj namirnici
    public function namirnica(): BelongsTo
    {
        return $this->belongsTo(Namirnica::class, 'namirnica_id');
    }
}
