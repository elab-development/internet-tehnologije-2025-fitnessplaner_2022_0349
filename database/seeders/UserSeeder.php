<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // KLIJENTI
        User::updateOrCreate(
            ['email' => 'test@test.com'],
            [
                'name' => 'Test Korisnik',
                'password' => Hash::make('password'),
                'uloga' => 'klijent',
            ]
        );

        User::updateOrCreate(
            ['email' => 'ana@test.com'],
            [
                'name' => 'Ana Mijić',
                'password' => Hash::make('password'),
                'uloga' => 'klijent',
            ]
        );

        User::updateOrCreate(
            ['email' => 'marko@test.com'],
            [
                'name' => 'Marko Marković',
                'password' => Hash::make('password'),
                'uloga' => 'klijent',
            ]
        );

        // TRENERI
        User::updateOrCreate(
            ['email' => 'trener1@test.com'],
            [
                'name' => 'Petar Trener',
                'password' => Hash::make('password'),
                'uloga' => 'trener',
            ]
        );

        User::updateOrCreate(
            ['email' => 'trener2@test.com'],
            [
                'name' => 'Jelena Trener',
                'password' => Hash::make('password'),
                'uloga' => 'trener',
            ]
        );

        // ADMIN
        User::updateOrCreate(
            ['email' => 'admin@test.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('admin123'),
                'uloga' => 'admin',
            ]
        );
    }
}

