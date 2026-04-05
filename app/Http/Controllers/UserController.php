<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\Tweet;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function show(\App\Models\User $user)
    {
        $authUser = Auth::user();
        
        $user->loadCount(['followers', 'following']);
        
        $tweets = $user->tweets()
            ->whereNull('parent_id')
            ->with(['user', 'likes', 'retweets', 'replies', 'replies.user'])
            ->latest()
            ->get()
            ->map(fn($tweet) => [
                'id' => $tweet->id,
                'user' => $tweet->user->name,
                'handle' => '@' . strtolower(str_replace(' ', '', $tweet->user->name)),
                'time' => $tweet->created_at->diffForHumans(short: true),
                'content' => $tweet->body,
                'likes' => $tweet->likes->count(),
                'retweets' => $tweet->retweets->count(),
                'replies' => $tweet->replies->count(),
                'avatar' => $tweet->user->avatar ?? "https://i.pravatar.cc/150?u=" . $tweet->user_id,
                'liked_by_user' => $authUser ? $tweet->likes->contains('id', $authUser->id) : false,
                'retweeted_by_user' => $authUser ? $tweet->retweets->contains('user_id', $authUser->id) : false,
            ]);

        $isFollowing = $authUser ? $authUser->following()->where('users.id', $user->id)->exists() : false;

        $whoToFollow = [];
        if ($authUser) {
            $followingIds = DB::table('follower_user')
                ->where('follower_id', $authUser->id)
                ->pluck('user_id')
                ->push($authUser->id)
                ->unique()
                ->values();

            $whoToFollow = User::whereNotIn('id', $followingIds)
                ->withCount('followers')
                ->inRandomOrder()
                ->limit(5)
                ->get()
                ->map(fn($u) => [
                    'id'           => $u->id,
                    'name'         => $u->name,
                    'handle'       => '@' . strtolower(str_replace(' ', '', $u->name)),
                    'avatar'       => $u->avatar ?? 'https://i.pravatar.cc/150?u=' . $u->id,
                    'followers'    => $u->followers_count,
                    'is_following' => false,
                ])->values()->all();
        }

        return Inertia::render('UserProfile', [
            'profileUser' => [
                'id' => $user->id,
                'name' => $user->name,
                'handle' => '@' . strtolower(str_replace(' ', '', $user->name)),
                'avatar' => $user->avatar ?? "https://i.pravatar.cc/150?u=" . $user->id,
                'bio' => 'Building the future of social networking with Flock. 🚀',
                'location' => 'Cyberworld',
                'followers_count' => $user->followers_count,
                'following_count' => $user->following_count,
                'is_following' => $isFollowing,
                'created_at' => $user->created_at->format('M Y'),
            ],
            'tweets' => $tweets,
            'trends' => $this->getTrends(),
            'whoToFollow' => $whoToFollow,
        ]);
    }

    private function getTrends()
    {
        return [
            ['tag' => '#Laravel', 'label' => '71.2K posts'],
            ['tag' => '#TailwindCSS', 'label' => '42.1K posts'],
            ['tag' => '#AlpineJS', 'label' => '12.4K posts'],
            ['tag' => '#XClone', 'label' => '1.5M posts'],
        ];
    }
}
