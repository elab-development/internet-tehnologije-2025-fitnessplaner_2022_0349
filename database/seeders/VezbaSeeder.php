<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Vezba;

class VezbaSeeder extends Seeder
{
    public function run(): void
    {
        Vezba::insert([
            [
                'naziv' => 'Cucanj',
                'opis' => 'Osnovna vezba za noge',
                'misicna_grupa' => 'Noge',
                'oprema' => 'Bodyweight',
                'video_url' => 'https://www.youtube.com/watch?v=aclHkVaku9U',
            ],
            [
                'naziv' => 'Sklek',
                'opis' => 'Vezba za grudi i triceps',
                'misicna_grupa' => 'Grudi',
                'oprema' => 'Bodyweight',
                'video_url' => 'https://www.youtube.com/watch?v=IODxDxX7oi4',
            ],
            [
                'naziv' => 'Plank',
                'opis' => 'Stabilizacija trupa',
                'misicna_grupa' => 'Core',
                'oprema' => 'Bodyweight',
                'video_url' => 'https://www.youtube.com/watch?v=pSHjTRCQxIw',
            ],
        ]);
    }
}
