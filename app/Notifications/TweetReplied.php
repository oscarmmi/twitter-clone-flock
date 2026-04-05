<?php

namespace App\Notifications;

use App\Models\Tweet;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class TweetReplied extends Notification
{
    use Queueable;

    public $reply;
    public $user;

    public function __construct(Tweet $reply, User $user)
    {
        // $reply is the newly created tweet that is a reply
        // $user is the person who replied
        $this->reply = $reply;
        $this->user = $user;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        return [
            'tweet_id' => $this->reply->id,
            'parent_id' => $this->reply->parent_id,
            'user_id' => $this->user->id,
            'user_name' => $this->user->name,
            'user_avatar' => $this->user->avatar ?? "https://i.pravatar.cc/150?u=" . $this->user->id,
            'body' => $this->reply->body,
        ];
    }
}
