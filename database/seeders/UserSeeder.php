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
                'ime i prezime' => 'Test Korisnik',
                'password' => bcrypt('password'),
            ]
        );
         User::updateOrCreate(
            ['email' => 'ana@test.com'],
            [
                'ime i prezime' => 'Ana Mijic',
                'password' => bcrypt('password'),
            ]
        );
         User::updateOrCreate(
            ['email' => 'marko@test.com'],
            [
                'ime i prezime' => 'Marko Markovic',
                'password' => bcrypt('password'),
            ]
        );
    }
}
