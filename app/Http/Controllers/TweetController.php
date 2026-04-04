<?php

namespace App\Http\Controllers;

use App\Models\Tweet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TweetController extends Controller
{
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
            ->get();

        return view('dashboard', compact('tweets'));
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
