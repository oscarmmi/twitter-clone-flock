<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tweet extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'body',
        'parent_id',
        'retweet_id',
    ];

    /**
     * The user who created the tweet.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * If this is a reply, the original tweet.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Tweet::class, 'parent_id');
    }

    /**
     * All replies to this tweet.
     */
    public function replies(): HasMany
    {
        return $this->hasMany(Tweet::class, 'parent_id');
    }

    /**
     * If this is a retweet, the original tweet being retweeted.
     */
    public function retweet(): BelongsTo
    {
        return $this->belongsTo(Tweet::class, 'retweet_id');
    }

    /**
     * Retweets of this tweet.
     */
    public function retweets(): HasMany
    {
        return $this->hasMany(Tweet::class, 'retweet_id');
    }

    /**
     * Users who liked this tweet.
     */
    public function likes(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'likes')->withTimestamps();
    }
}
