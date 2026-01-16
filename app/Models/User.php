<?php

namespace App\Models;


use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
     use HasApiTokens, HasFactory, Notifiable;


    protected $fillable = [
        'name',
        'email',
        'password',
        'uloga', // admin | trener | korisnik
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /* ================= RELACIJE ================= */

    public function treninzi()
    {
        return $this->hasMany(Trening::class, 'korisnik_id');
    }

    public function rasporediTreninga()
    {
        return $this->hasMany(RasporedTreninga::class, 'korisnik_id');
    }

    public function dnevniciIshrane()
    {
        return $this->hasMany(DnevnikIshrane::class, 'korisnik_id');
    }

    public function hidratacije()
    {
        return $this->hasMany(Hidratacija::class, 'korisnik_id');
    }
}
