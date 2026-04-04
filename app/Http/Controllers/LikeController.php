<?php

namespace App\Http\Controllers;

use App\Models\Tweet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
        }

        return response()->json([
            'liked' => $liked,
            'likes_count' => $tweet->likes()->count(),
        ]);
    }
}
