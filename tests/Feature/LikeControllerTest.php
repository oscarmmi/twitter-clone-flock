<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Tweet;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LikeControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_like_and_unlike_tweet()
    {
        $user = User::factory()->create();
        $author = User::factory()->create();
        $tweet = Tweet::factory()->create(['user_id' => $author->id]);

        // Like
        $response = $this->actingAs($user)->post("/tweets/{$tweet->id}/like");

        $response->assertStatus(200);
        $response->assertJson(['liked' => true, 'likes_count' => 1]);
        $this->assertDatabaseHas('likes', [
            'user_id' => $user->id,
            'tweet_id' => $tweet->id,
        ]);

        // Unlike
        $response = $this->actingAs($user)->post("/tweets/{$tweet->id}/like");

        $response->assertStatus(200);
        $response->assertJson(['liked' => false, 'likes_count' => 0]);
        $this->assertDatabaseMissing('likes', [
            'user_id' => $user->id,
            'tweet_id' => $tweet->id,
        ]);
    }
}
