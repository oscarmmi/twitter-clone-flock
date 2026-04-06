<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\TweetController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\FollowController;

Route::get('/', [TweetController::class, 'welcome'])->name('welcome');
Route::get('/tweets/{tweet}', [TweetController::class, 'show'])->name('tweets.show');
Route::get('/search', [TweetController::class, 'search'])->name('search');
Route::get('/tweets-fetch', [TweetController::class, 'fetch'])->name('tweets.fetch');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [TweetController::class, 'index'])->name('dashboard');
    
    // Tweets
    Route::post('/tweets', [TweetController::class, 'store'])->name('tweets.store');
    Route::post('/tweets/{tweet}/reply', [TweetController::class, 'reply'])->name('tweets.reply');
    Route::post('/tweets/{tweet}/retweet', [TweetController::class, 'retweet'])->name('tweets.retweet');

    // Likes
    Route::post('/tweets/{tweet}/like', [LikeController::class, 'toggle'])->name('tweets.like');

    // Follows
    Route::post('/users/{user}/follow', [FollowController::class, 'toggle'])->name('users.follow');

    // Profile (public view)
    Route::get('/u/{user}', [UserController::class, 'show'])->name('user.show');
    Route::get('/u/{user}/tweets', [UserController::class, 'fetch'])->name('user.tweets.fetch');


    // Notifications
    Route::get('/notifications', [\App\Http\Controllers\NotificationController::class, 'index'])->name('notifications.index');
    Route::get('/notifications/unread-count', [\App\Http\Controllers\NotificationController::class, 'unreadCount'])->name('notifications.unread-count');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
