<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\DnevnikIshrane;
use App\Models\StavkaIshrane;
use App\Models\Namirnica;

class IshranaSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();

        $dnevnik = DnevnikIshrane::create([
            'korisnik_id' => $user->id,
            'datum' => now()->toDateString(),
        ]);

        $piletina = Namirnica::where('naziv', 'Piletina')->first();
        $pirinac = Namirnica::where('naziv', 'Pirinač')->first();

        StavkaIshrane::insert([
            [
                'dnevnik_ishrane_id' => $dnevnik->id,
                'namirnica_id' => $piletina->id,
                'kolicina_g' => 200,
                'obrok' => 'rucak',
            ],
            [
                'dnevnik_ishrane_id' => $dnevnik->id,
                'namirnica_id' => $pirinac->id,
                'kolicina_g' => 150,
                'obrok' => 'rucak',
            ],
        ]);
    }
}
