<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // updateOrCreate: neće duplirati korisnika ako ponovo seeduješ
        User::updateOrCreate(
            ['email' => 'test@test.com'],
            [
                'name' => 'Test Korisnik',
                'password' => bcrypt('password'),
            ]
        );
    }
}
