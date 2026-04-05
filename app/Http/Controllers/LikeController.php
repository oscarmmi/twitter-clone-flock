<?php

namespace App\Http\Controllers;

use App\Models\Tweet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Notifications\TweetLiked;

class LikeController extends Controller
{
    public function toggle(Request $request, Tweet $tweet)
    {
        $user = Auth::user();

        if ($user->likesTweet($tweet)) {
            $user->likes()->detach($tweet->id);
            $liked = false;
        } else {
            $user->likes()->attach($tweet->id);
            $liked = true;

            // Notify the tweet owner if it's not the same user
            if ($tweet->user_id !== $user->id) {
                $tweet->user->notify(new TweetLiked($tweet, $user));
            }
        }

        return response()->json([
            'liked' => $liked,
            'likes_count' => $tweet->likes()->count(),
        ]);
    }
}
