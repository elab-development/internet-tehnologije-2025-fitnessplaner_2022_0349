<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Hidratacija;

class HidratacijaSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();

        Hidratacija::create([
            'korisnik_id' => $user->id,
            'datum' => now()->toDateString(),
            'cilj_ml' => 2000,
            'uneseno_ml' => 750,
        ]);
    }
}
