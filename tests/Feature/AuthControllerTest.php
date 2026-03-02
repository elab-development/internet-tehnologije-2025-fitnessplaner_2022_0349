<?php
namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    // ==========================================
    // AUTHENTICATION TESTS
    // ==========================================

    public function test_user_can_register()
    {
        $payload = [
            'name'     => 'Petar Petrovic',
            'email'    => 'petar@example.com',
            'password' => 'password123',
        ];

        $response = $this->postJson('/api/register', $payload);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'token',
                'user' => ['id', 'ime', 'email', 'uloga'],
            ])
            ->assertJsonPath('user.uloga', 'klijent'); // Checks default role

        $this->assertDatabaseHas('users', [
            'email'         => 'petar@example.com',
            'ime_i_prezime' => 'Petar Petrovic',
            'uloga'         => 'klijent',
        ]);
    }

    public function test_user_can_login_with_correct_credentials()
    {
        $user = User::factory()->create([
            'email'    => 'test@example.com',
            'password' => bcrypt('secret123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email'    => 'test@example.com',
            'password' => 'secret123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['token', 'user']);
    }

    public function test_login_fails_with_invalid_credentials()
    {
        $user = User::factory()->create([
            'email'    => 'test@example.com',
            'password' => bcrypt('secret123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email'    => 'test@example.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401)
            ->assertJson(['message' => 'Pogrešan email ili lozinka.']);
    }
}
