<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        $notifications = $user->notifications->map(function ($n) {
            return [
                'id' => $n->id,
                'data' => $n->data,
                'read_at' => $n->read_at,
                'time' => $n->created_at->diffForHumans(short: true),
                'type' => $n->type,
            ];
        });

        // Mark all as read when viewing
        $user->unreadNotifications->markAsRead();

        return inertia('Notifications', [
            'notifications' => $notifications,
        ]);
    }
}
