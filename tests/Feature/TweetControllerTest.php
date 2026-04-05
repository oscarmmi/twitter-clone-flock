<?php

namespace Tests\Feature;

use App\Models\Tweet;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TweetControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_welcome_page_displays_tweets()
    {
        $user = User::factory()->create();
        Tweet::factory()->count(3)->create(['user_id' => $user->id]);

        $response = $this->get('/');

        $response->assertStatus(200);
        // Inertia testing can be added if needed, but simple status is a good start
    }

    public function test_index_displays_followed_tweets()
    {
        $user = User::factory()->create();
        $followedUser = User::factory()->create();

        $user->following()->attach($followedUser->id);

        Tweet::factory()->create(['user_id' => $followedUser->id]);

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertStatus(200);
    }

    public function test_user_can_store_tweet()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/tweets', [
            'body' => 'This is a test tweet',
        ]);

        $response->assertStatus(302);
        $this->assertDatabaseHas('tweets', [
            'body' => 'This is a test tweet',
            'user_id' => $user->id,
        ]);
    }

    public function test_user_cannot_store_empty_tweet()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/tweets', [
            'body' => '',
        ]);

        $response->assertSessionHasErrors('body');
    }

    public function test_show_tweet_page()
    {
        $user = User::factory()->create();
        $tweet = Tweet::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->get("/tweets/{$tweet->id}");

        $response->assertStatus(200);
    }

    public function test_user_can_reply_to_tweet()
    {
        $user = User::factory()->create();
        $author = User::factory()->create();
        $tweet = Tweet::factory()->create(['user_id' => $author->id]);

        $response = $this->actingAs($user)->post("/tweets/{$tweet->id}/reply", [
            'body' => 'This is a reply',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('tweets', [
            'body' => 'This is a reply',
            'parent_id' => $tweet->id,
            'user_id' => $user->id,
        ]);
    }

    public function test_user_can_retweet()
    {
        $user = User::factory()->create();
        $author = User::factory()->create();
        $tweet = Tweet::factory()->create(['user_id' => $author->id]);

        $response = $this->actingAs($user)->post("/tweets/{$tweet->id}/retweet");

        $response->assertStatus(200);
        $response->assertJson(['retweeted' => true]);

        $this->assertDatabaseHas('tweets', [
            'retweet_id' => $tweet->id,
            'user_id' => $user->id,
        ]);

        // Test un-retweeting
        $response = $this->actingAs($user)->post("/tweets/{$tweet->id}/retweet");

        $response->assertStatus(200);
        $response->assertJson(['retweeted' => false]);

        $this->assertDatabaseMissing('tweets', [
            'retweet_id' => $tweet->id,
            'user_id' => $user->id,
        ]);
    }

    public function test_search_returns_results()
    {
        $user = User::factory()->create(['name' => 'Searchable User']);
        Tweet::factory()->create(['body' => 'This is a searchable tweet', 'user_id' => $user->id]);

        $response = $this->actingAs($user)->get('/search?q=searchable');

        $response->assertStatus(200);
    }
}
