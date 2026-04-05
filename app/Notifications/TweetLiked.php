<?php

namespace App\Notifications;

use App\Models\Tweet;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class TweetLiked extends Notification
{
    use Queueable;

    public $tweet;
    public $user;

    public function __construct(Tweet $tweet, User $user)
    {
        $this->tweet = $tweet;
        $this->user = $user;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        return [
            'tweet_id' => $this->tweet->id,
            'user_id' => $this->user->id,
            'user_name' => $this->user->name,
            'user_avatar' => $this->user->avatar ?? "https://i.pravatar.cc/150?u=" . $this->user->id,
            'body' => $this->tweet->body,
        ];
    }
}
