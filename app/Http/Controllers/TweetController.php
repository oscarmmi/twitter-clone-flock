<?php

namespace App\Http\Controllers;

use App\Models\Tweet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TweetController extends Controller
{
    public function welcome(Request $request)
    {
        $tweets = Tweet::whereNull('parent_id') // only original tweets, no replies
            ->with(['user', 'likes', 'retweets', 'replies'])
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
            ]);

        return inertia('Welcome', [
            'tweets' => $tweets
        ]);
    }

    public function index(Request $request)
    {
        $user = Auth::user();
        
        // Get tweets from user and people they follow
        $followingIds = $user->following()->pluck('users.id');
        $followingIds->push($user->id);

        $tweets = Tweet::whereIn('user_id', $followingIds)
            ->whereNull('parent_id') // main tweets on timeline
            ->with(['user', 'likes', 'retweets', 'replies'])
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
            ]);

        return inertia('Dashboard', [
            'tweets' => $tweets
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'body' => 'required|max:280',
        ]);

        Auth::user()->tweets()->create([
            'body' => $request->body,
        ]);

        return back();
    }

    public function reply(Request $request, Tweet $tweet)
    {
        $request->validate([
            'body' => 'required|max:280',
        ]);

        Auth::user()->tweets()->create([
            'body' => $request->body,
            'parent_id' => $tweet->id,
        ]);

        return back();
    }

    public function retweet(Request $request, Tweet $tweet)
    {
        // If already retweeted, un-retweet? (Optional, but let's just create or delete)
        $existing = Auth::user()->tweets()->where('retweet_id', $tweet->id)->first();
        
        if ($existing) {
            $existing->delete();
        } else {
            Auth::user()->tweets()->create([
                'retweet_id' => $tweet->id,
            ]);
        }

        return back();
    }

    public function search(Request $request)
    {
        $query = $request->input('q');
        
        if ($query) {
            $tweets = Tweet::where('body', 'like', "%{$query}%")
                ->whereNull('parent_id')
                ->whereNull('retweet_id')
                ->with(['user', 'likes', 'retweets'])
                ->latest()
                ->get();
        } else {
            $tweets = collect();
        }

        return view('search', compact('tweets', 'query'));
    }
}
