<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Trening;
use App\Models\IzvodjenjeVezbe;
use App\Models\Vezba;

class TreningSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first(); // uzmi prvog korisnika

        $trening = Trening::create([
            'korisnik_id' => $user->id,
            'naziv' => 'Noge - pocetni',
            'trajanje_minuta' => 45,
            'tezina' => 'lako',
        ]);

        $cucanj = Vezba::where('naziv', 'Cucanj')->first();
        $plank = Vezba::where('naziv', 'Plank')->first();

        IzvodjenjeVezbe::insert([
            [
                'trening_id' => $trening->id,
                'vezba_id' => $cucanj->id,
                'redosled' => 1,
                'serije' => 3,
                'ponavljanja' => 12,
                'pauza_sekundi' => 60,
            ],
            [
                'trening_id' => $trening->id,
                'vezba_id' => $plank->id,
                'redosled' => 2,
                'serije' => 3,
                'ponavljanja' => 30,
                'pauza_sekundi' => 45,
            ],
        ]);
    }
}
