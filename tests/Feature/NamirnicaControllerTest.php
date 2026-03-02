<?php
namespace Tests\Feature;

use App\Models\Namirnica;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NamirnicaControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    public function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->actingAs($this->user);
    }

    public function test_can_fetch_all_namirnice()
    {
        Namirnica::factory()->count(3)->create();

        $response = $this->getJson('/api/namirnice');

        $response->assertStatus(200)
            ->assertJsonCount(3);
    }

    public function test_can_create_namirnica_with_valid_data()
    {
        $payload = [
            'naziv'                   => 'Pileca prsa',
            'kalorije_na_100g'        => 165,
            'proteini_na_100g'        => 31.0,
            'ugljeni_hidrati_na_100g' => 0.0,
            'masti_na_100g'           => 3.6,
        ];

        $response = $this->postJson('/api/namirnice', $payload);

        $response->assertStatus(201)
            ->assertJsonFragment(['naziv' => 'Pileca prsa']);

        $this->assertDatabaseHas('namirnice', ['naziv' => 'Pileca prsa']);
    }

    public function test_cannot_create_namirnica_with_invalid_data()
    {
        // Missing "kalorije" and "proteini"
        $payload = [
            'naziv'                   => 'Test',
            'ugljeni_hidrati_na_100g' => 10,
            'masti_na_100g'           => 5,
        ];

        $response = $this->postJson('/api/namirnice', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['kalorije_na_100g', 'proteini_na_100g']);
    }

    public function test_can_show_single_namirnica()
    {
        $namirnica = Namirnica::factory()->create();

        $response = $this->getJson("/api/namirnice/{$namirnica->id}");

        $response->assertStatus(200)
            ->assertJsonPath('naziv', $namirnica->naziv);
    }

    public function test_can_update_namirnica()
    {
        $namirnica = Namirnica::factory()->create([
            'naziv' => 'Stari naziv',
        ]);

        $payload = [
            'naziv'                   => 'Novi naziv',
            'kalorije_na_100g'        => 100,
            'proteini_na_100g'        => 10.0,
            'ugljeni_hidrati_na_100g' => 10.0,
            'masti_na_100g'           => 10.0,
        ];

        $response = $this->putJson("/api/namirnice/{$namirnica->id}", $payload);

        $response->assertStatus(200)
            ->assertJsonPath('naziv', 'Novi naziv');

        $this->assertDatabaseHas('namirnice', ['naziv' => 'Novi naziv']);
    }

    public function test_update_returns_404_if_not_found()
    {
        $payload = Namirnica::factory()->make()->toArray();

        $response = $this->putJson("/api/namirnice/9999", $payload);

        $response->assertStatus(404)
            ->assertJson(['message' => 'Namirnica nije pronadjena.']);
    }

    public function test_can_delete_namirnica()
    {
        $namirnica = Namirnica::factory()->create();

        $response = $this->deleteJson("/api/namirnice/{$namirnica->id}");

        $response->assertStatus(200)
            ->assertJson(['message' => 'Namirnica je obrisana.']);

        $this->assertDatabaseMissing('namirnice', ['id' => $namirnica->id]);
    }
}
