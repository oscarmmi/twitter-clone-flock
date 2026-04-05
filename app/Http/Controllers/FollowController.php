<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FollowController extends Controller
{
    public function toggle(Request $request, User $user)
    {
        $currentUser = Auth::user();

        if ($currentUser->id === $user->id) {
            return back()->with('error', 'You cannot follow yourself.');
        }

        $isNowFollowing = false;

        if ($currentUser->follows($user)) {
            $currentUser->following()->detach($user->id);
            $isNowFollowing = false;
        } else {
            $currentUser->following()->attach($user->id);
            $isNowFollowing = true;
        }

        return response()->json([
            'following'       => $isNowFollowing,
            'followers_count' => $user->followers()->count(),
        ]);
    }
}
