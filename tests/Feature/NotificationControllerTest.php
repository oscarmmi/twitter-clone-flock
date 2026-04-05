<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Tweet;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotificationControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_notifications()
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $tweet = Tweet::factory()->create(['user_id' => $user->id]);

        // Trigger a notification (e.g. by liking a tweet)
        $this->actingAs($otherUser)->post("/tweets/{$tweet->id}/like");

        // Now, viewer checks their notifications
        $response = $this->actingAs($user)->get('/notifications');

        $response->assertStatus(200);

        // Notifications should be marked as read
        $this->assertEquals(0, $user->unreadNotifications()->count());
    }

    public function test_unread_count_is_correct()
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $tweet = Tweet::factory()->create(['user_id' => $user->id]);

        // Initially 0
        $response = $this->actingAs($user)->get('/notifications/unread-count');
        $response->assertStatus(200);
        $response->assertJson(['count' => 0]);

        // Trigger a notification
        $this->actingAs($otherUser)->post("/tweets/{$tweet->id}/like");

        // Now it should be 1
        $response = $this->actingAs($user)->get('/notifications/unread-count');
        $response->assertStatus(200);
        $response->assertJson(['count' => 1]);
    }
}
