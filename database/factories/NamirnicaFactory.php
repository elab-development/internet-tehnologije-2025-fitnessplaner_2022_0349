<?php
namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Namirnica>
 */
class NamirnicaFactory extends Factory
{
    public function definition(): array
    {
        return [
            'naziv'                   => fake()->word() . ' ' . fake()->word(),
            'kalorije_na_100g'        => fake()->numberBetween(20, 500),
            'proteini_na_100g'        => fake()->randomFloat(2, 0, 30),
            'ugljeni_hidrati_na_100g' => fake()->randomFloat(2, 0, 80),
            'masti_na_100g'           => fake()->randomFloat(2, 0, 40),
        ];
    }
}
