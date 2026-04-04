<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function tweets()
    {
        return $this->hasMany(Tweet::class);
    }

    public function following()
    {
        return $this->belongsToMany(User::class, 'follower_user', 'follower_id', 'user_id')->withTimestamps();
    }

    public function followers()
    {
        return $this->belongsToMany(User::class, 'follower_user', 'user_id', 'follower_id')->withTimestamps();
    }

    public function likes()
    {
        return $this->belongsToMany(Tweet::class, 'likes')->withTimestamps();
    }

    public function follows(User $user)
    {
        return $this->following()->where('user_id', $user->id)->exists();
    }

    public function likesTweet(Tweet $tweet)
    {
        return $this->likes()->where('tweet_id', $tweet->id)->exists();
    }
}
