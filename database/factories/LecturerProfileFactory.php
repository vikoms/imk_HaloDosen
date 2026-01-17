<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\LecturerProfile>
 */
class LecturerProfileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nidn' => fake()->unique()->numerify('##########'),
            'current_quota' => fake()->numberBetween(0, 10),
            'is_active' => true,
        ];
    }
}
