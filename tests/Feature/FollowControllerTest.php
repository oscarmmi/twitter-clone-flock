<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FollowControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_follow_and_unfollow_another_user()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        // Follow
        $response = $this->actingAs($user1)->post("/users/{$user2->id}/follow");

        $response->assertStatus(200);
        $response->assertJson(['following' => true, 'followers_count' => 1]);
        $this->assertDatabaseHas('follower_user', [
            'follower_id' => $user1->id,
            'user_id' => $user2->id,
        ]);

        // Unfollow
        $response = $this->actingAs($user1)->post("/users/{$user2->id}/follow");

        $response->assertStatus(200);
        $response->assertJson(['following' => false, 'followers_count' => 0]);
        $this->assertDatabaseMissing('follower_user', [
            'follower_id' => $user1->id,
            'user_id' => $user2->id,
        ]);
    }

    public function test_user_cannot_follow_themselves()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post("/users/{$user->id}/follow");

        $response->assertStatus(302);
        $response->assertSessionHas('error', 'You cannot follow yourself.');

        $this->assertDatabaseMissing('follower_user', [
            'follower_id' => $user->id,
            'user_id' => $user->id,
        ]);
    }
}
