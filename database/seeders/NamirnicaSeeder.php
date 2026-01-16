<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Namirnica;

class NamirnicaSeeder extends Seeder
{
    public function run(): void
    {
        Namirnica::insert([
            [
                'naziv' => 'Piletina',
                'kalorije_na_100g' => 165,
                'proteini_na_100g' => 31,
                'ugljeni_hidrati_na_100g' => 0,
                'masti_na_100g' => 3.6,
            ],
            [
                'naziv' => 'Pirinač',
                'kalorije_na_100g' => 130,
                'proteini_na_100g' => 2.7,
                'ugljeni_hidrati_na_100g' => 28,
                'masti_na_100g' => 0.3,
            ],
            [
                'naziv' => 'Banana',
                'kalorije_na_100g' => 89,
                'proteini_na_100g' => 1.1,
                'ugljeni_hidrati_na_100g' => 23,
                'masti_na_100g' => 0.3,
            ],
        ]);
    }
}
