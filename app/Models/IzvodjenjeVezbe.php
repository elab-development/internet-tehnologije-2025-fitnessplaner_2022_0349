<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IzvodjenjeVezbe extends Model
{
    use HasFactory;

    protected $table = 'izvodjenja_vezbi';

    protected $fillable = [
        'trening_id',
        'vezba_id',
        'redosled',
        'serije',
        'ponavljanja',
        'pauza_sekundi',
        'napomena',
    ];

    public function trening(): BelongsTo
    {
        return $this->belongsTo(Trening::class, 'trening_id');
    }

    public function vezba(): BelongsTo
    {
        return $this->belongsTo(Vezba::class, 'vezba_id');
    }
}
