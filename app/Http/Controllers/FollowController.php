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

        if ($currentUser->follows($user)) {
            $currentUser->following()->detach($user->id);
        } else {
            $currentUser->following()->attach($user->id);
        }

        return back();
    }
}
