<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Tweet;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_profile_page_displays_correctly()
    {
        $viewer = User::factory()->create();
        $profileUser = User::factory()->create();

        Tweet::factory()->count(2)->create(['user_id' => $profileUser->id]);

        $response = $this->actingAs($viewer)->get("/u/{$profileUser->id}");

        $response->assertStatus(200);
        // Additional Inertia assertions can be done here.
    }
}
