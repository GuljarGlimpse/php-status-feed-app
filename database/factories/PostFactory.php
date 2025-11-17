<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(6),
            'author' => $this->faker->name(),
            'body' => collect(range(1, 3))->map(fn () => $this->faker->paragraph())->implode("\n\n"),
            'cover_image' => $this->faker->optional(0.4)->imageUrl(640, 360, 'abstract', true),
            'published_at' => $this->faker->dateTimeBetween('-10 days', 'now'),
        ];
    }
}
