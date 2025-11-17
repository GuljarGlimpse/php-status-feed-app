<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Profile>
 */
class ProfileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'display_name' => $this->faker->name(),
            'bio' => $this->faker->paragraph(),
            'location' => $this->faker->city(),
            'website' => $this->faker->optional()->url(),
            'avatar_url' => $this->faker->optional()->imageUrl(256, 256, 'people', true),
        ];
    }
}
