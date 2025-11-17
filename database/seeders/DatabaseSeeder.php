<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Post;
use App\Models\Profile;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Profile::factory()->create([
            'display_name' => 'Product Storyteller',
            'bio' => 'Highlighting what our community ships every week.',
            'location' => 'Remote',
            'website' => 'https://example.com',
        ]);

        Post::factory(6)
            ->create()
            ->each(function (Post $post) {
                Comment::factory(random_int(1, 4))
                    ->create(['post_id' => $post->id]);
            });
    }
}
