<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function show(User $user)
    {
        $tweets = $user->tweets()
            ->latest()
            ->with(['user', 'likes', 'retweets', 'replies'])
            ->get();

        return view('profile.show', compact('user', 'tweets'));
    }
}
