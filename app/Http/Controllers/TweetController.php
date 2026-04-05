<?php

namespace App\Http\Controllers;

use App\Models\Tweet;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TweetController extends Controller
{
    public function welcome(Request $request)
    {
        $authUser = Auth::user();

        $tweets = Tweet::whereNull('parent_id')   // exclude replies
            ->with([
                'user', 'likes', 'retweets', 'replies', 'replies.user',
                'retweet', 'retweet.user', 'retweet.likes',  // load original tweet when this is a retweet
            ])
            ->latest()
            ->get()
            ->map(function ($tweet) use ($authUser) {
                // If this is a retweet, show the original tweet's content
                $source = $tweet->retweet_id ? $tweet->retweet : $tweet;

                if (!$source || !$source->user) return null; // skip broken retweets

                return [
                    'id' => $source->id,
                    'user' => $source->user->name,
                    'handle' => '@' . strtolower(str_replace(' ', '', $source->user->name)),
                    'time' => $source->created_at->diffForHumans(short: true),
                    'content' => $source->body,
                    'likes' => $source->likes->count(),
                    'retweets' => $source->retweets->count(),
                    'replies' => $source->replies()->count(),
                    'avatar' => $source->user->avatar ?? "https://i.pravatar.cc/150?u=" . $source->user_id,
                    'liked_by_user' => $authUser ? $source->likes->contains('id', $authUser->id) : false,
                    'retweeted_by_user' => $authUser ? $source->retweets->contains('user_id', $authUser->id) : false,
                    'replies_list' => $source->replies()->with('user')->latest()->get()->map(fn($r) => [
                        'id' => $r->id,
                        'user' => $r->user->name,
                        'handle' => '@' . strtolower(str_replace(' ', '', $r->user->name)),
                        'avatar' => $r->user->avatar ?? "https://i.pravatar.cc/150?u=" . $r->user_id,
                        'body' => $r->body,
                        'time' => $r->created_at->diffForHumans(short: true),
                    ])->values()->all(),
                    // Retweet banner info
                    'is_retweet' => !!$tweet->retweet_id,
                    'retweeted_by' => $tweet->retweet_id ? $tweet->user->name : null,
                    'retweeted_by_handle' => $tweet->retweet_id ? ('@' . strtolower(str_replace(' ', '', $tweet->user->name))) : null,
                ];
            })
            ->filter()
            ->values();

        $whoToFollow = [];
        if ($authUser) {
            // Query the pivot table directly to avoid BelongsToMany pluck ambiguity in PostgreSQL
            $followingIds = DB::table('follower_user')
                ->where('follower_id', $authUser->id)
                ->pluck('user_id')
                ->push($authUser->id)   // also exclude self
                ->unique()
                ->values();

            $whoToFollow = User::whereNotIn('id', $followingIds)
                ->withCount('followers')
                ->inRandomOrder()
                ->limit(5)
                ->get()
                ->map(fn($u) => [
                    'id'           => $u->id,
                    'name'         => $u->name,
                    'handle'       => '@' . strtolower(str_replace(' ', '', $u->name)),
                    'avatar'       => $u->avatar ?? 'https://i.pravatar.cc/150?u=' . $u->id,
                    'followers'    => $u->followers_count,
                    'is_following' => false,
                ])->values()->all();
        }

        return inertia('Welcome', [
            'tweets'       => $tweets,
            'trends'       => $this->getTrends(),
            'whoToFollow'  => $whoToFollow,
        ]);

    }

    public function index(Request $request)
    {
        $user = Auth::user();
        
        // Get tweets from user and people they follow
        $followingIds = $user->following()->pluck('users.id');
        $followingIds->push($user->id);

        $tweets = Tweet::whereIn('user_id', $followingIds)
            ->whereNull('parent_id')               // exclude replies
            ->with([
                'user', 'likes', 'retweets', 'replies', 'replies.user',
                'retweet', 'retweet.user', 'retweet.likes',
            ])
            ->latest()
            ->get()
            ->map(function ($tweet) use ($user) {
                $source = $tweet->retweet_id ? $tweet->retweet : $tweet;

                if (!$source || !$source->user) return null;

                return [
                    'id' => $source->id,
                    'user' => $source->user->name,
                    'handle' => '@' . strtolower(str_replace(' ', '', $source->user->name)),
                    'time' => $source->created_at->diffForHumans(short: true),
                    'content' => $source->body,
                    'likes' => $source->likes->count(),
                    'retweets' => $source->retweets->count(),
                    'replies' => $source->replies()->count(),
                    'avatar' => $source->user->avatar ?? "https://i.pravatar.cc/150?u=" . $source->user_id,
                    'liked_by_user' => $source->likes->contains('id', $user->id),
                    'retweeted_by_user' => $source->retweets->contains('user_id', $user->id),
                    'replies_list' => $source->replies()->with('user')->latest()->get()->map(fn($r) => [
                        'id' => $r->id,
                        'user' => $r->user->name,
                        'handle' => '@' . strtolower(str_replace(' ', '', $r->user->name)),
                        'avatar' => $r->user->avatar ?? "https://i.pravatar.cc/150?u=" . $r->user_id,
                        'body' => $r->body,
                        'time' => $r->created_at->diffForHumans(short: true),
                    ])->values()->all(),
                    'is_retweet' => !!$tweet->retweet_id,
                    'retweeted_by' => $tweet->retweet_id ? $tweet->user->name : null,
                    'retweeted_by_handle' => $tweet->retweet_id ? ('@' . strtolower(str_replace(' ', '', $tweet->user->name))) : null,
                ];
            })
            ->filter()
            ->values();

        $whoToFollow = DB::table('users')
            ->whereNotIn('id', DB::table('follower_user')->where('follower_id', $user->id)->pluck('user_id')->push($user->id))
            ->inRandomOrder()
            ->limit(5)
            ->get()
            ->map(fn($u) => [
                'id'           => $u->id,
                'name'         => $u->name,
                'handle'       => '@' . strtolower(str_replace(' ', '', $u->name)),
                'avatar'       => $u->avatar ?? 'https://i.pravatar.cc/150?u=' . $u->id,
                'followers'    => DB::table('follower_user')->where('user_id', $u->id)->count(),
                'is_following' => false,
            ]);

        return inertia('Welcome', [
            'tweets'      => $tweets,
            'trends'      => $this->getTrends(),
            'whoToFollow' => $whoToFollow,
        ]);
    }

    private function getTrends(): array
    {
        $results = DB::select("
            SELECT
                lower(match[1]) AS tag,
                COUNT(*)::int   AS total
            FROM tweets,
                 regexp_matches(body, '#([A-Za-z0-9_]+)', 'g') AS match
            WHERE body IS NOT NULL
            GROUP BY lower(match[1])
            ORDER BY total DESC
            LIMIT 10
        ");

        return array_map(function ($row) {
            $count = $row->total;
            $label = $count >= 1000
                ? number_format($count / 1000, 1) . 'K posts'
                : $count . ' posts';

            return [
                'tag'   => '#' . $row->tag,
                'count' => $count,
                'label' => $label,
            ];
        }, $results);
    }

    public function store(Request $request)
    {
        $request->validate([
            'body' => 'required|max:280',
        ]);

        Auth::user()->tweets()->create([
            'body' => $request->body,
        ]);

        return back();
    }

    public function show(Request $request, Tweet $tweet)
    {
        $authUser = Auth::user();

        $tweet->load(['user', 'likes', 'retweets', 'replies.user', 'replies.likes']);

        $tweetData = [
            'id' => $tweet->id,
            'user' => $tweet->user->name,
            'handle' => '@' . strtolower(str_replace(' ', '', $tweet->user->name)),
            'time' => $tweet->created_at->diffForHumans(),
            'created_at_full' => $tweet->created_at->format('g:i A · M j, Y'),
            'content' => $tweet->body,
            'likes' => $tweet->likes->count(),
            'retweets' => $tweet->retweets->count(),
            'replies' => $tweet->replies->count(),
            'avatar' => $tweet->user->avatar ?? "https://i.pravatar.cc/150?u=" . $tweet->user_id,
            'liked_by_user' => $authUser ? $tweet->likes->contains('id', $authUser->id) : false,
            'retweeted_by_user' => $authUser ? $tweet->retweets->contains('user_id', $authUser->id) : false,
            'replies_list' => $tweet->replies->map(fn($r) => [
                'id' => $r->id,
                'user' => $r->user->name,
                'handle' => '@' . strtolower(str_replace(' ', '', $r->user->name)),
                'avatar' => $r->user->avatar ?? "https://i.pravatar.cc/150?u=" . $r->user_id,
                'body' => $r->body,
                'time' => $r->created_at->diffForHumans(short: true),
                'likes' => $r->likes->count(),
                'liked_by_user' => $authUser ? $r->likes->contains('id', $authUser->id) : false,
            ])->values()->all(),
        ];

        return inertia('TweetShow', [
            'tweet' => $tweetData,
        ]);
    }

    public function reply(Request $request, Tweet $tweet)
    {
        $request->validate([
            'body' => 'required|max:280',
        ]);

        $reply = Auth::user()->tweets()->create([
            'body' => $request->body,
            'parent_id' => $tweet->id,
        ]);

        return response()->json([
            'success' => true,
            'reply_id' => $reply->id,
            'replies_count' => $tweet->replies()->count(),
        ]);
    }

    public function retweet(Request $request, Tweet $tweet)
    {
        $user = Auth::user();
        $existing = $user->tweets()->where('retweet_id', $tweet->id)->first();

        if ($existing) {
            $existing->delete();
            $retweeted = false;
        } else {
            $user->tweets()->create([
                'retweet_id' => $tweet->id,
            ]);
            $retweeted = true;
        }

        return response()->json([
            'retweeted' => $retweeted,
            'retweets_count' => $tweet->retweets()->count(),
        ]);
    }

    public function search(Request $request)
    {
        $query   = trim($request->input('q', ''));
        $authUser = Auth::user();

        if ($query) {
            // --- Tweets ---
            $tweetsRaw = Tweet::where('body', 'like', "%{$query}%")
                ->whereNull('parent_id')
                ->whereNull('retweet_id')
                ->where('user_id', '!=', $authUser->id)
                ->with(['user', 'likes', 'retweets', 'replies'])
                ->latest()
                ->get()
                ->map(function ($tweet) use ($authUser) {
                    if (!$tweet->user) return null;
                    return [
                        'id'                 => $tweet->id,
                        'user'               => $tweet->user->name,
                        'handle'             => '@' . strtolower(str_replace(' ', '', $tweet->user->name)),
                        'avatar'             => $tweet->user->avatar ?? 'https://i.pravatar.cc/150?u=' . $tweet->user_id,
                        'time'               => $tweet->created_at->diffForHumans(short: true),
                        'content'            => $tweet->body,
                        'likes'              => $tweet->likes->count(),
                        'retweets'           => $tweet->retweets->count(),
                        'replies'            => $tweet->replies->count(),
                        'liked_by_user'      => $authUser ? $tweet->likes->contains('id', $authUser->id) : false,
                        'retweeted_by_user'  => $authUser ? $tweet->retweets->contains('user_id', $authUser->id) : false,
                        'replies_list'       => [],
                        'is_retweet'         => false,
                        'retweeted_by'       => null,
                        'retweeted_by_handle'=> null,
                    ];
                })
                ->filter()
                ->values();

            // --- Users ---
            $usersRaw = User::where('name', 'like', "%{$query}%")
                ->orWhere('email', 'like', "%{$query}%")
                ->where('id', '!=', $authUser->id)
                ->withCount(['tweets', 'followers', 'following'])
                ->latest()
                ->limit(20)
                ->get()
                ->map(function ($u) use ($authUser) {
                    return [
                        'id'             => $u->id,
                        'name'           => $u->name,
                        'handle'         => '@' . strtolower(str_replace(' ', '', $u->name)),
                        'avatar'         => $u->avatar ?? 'https://i.pravatar.cc/150?u=' . $u->id,
                        'bio'            => $u->bio ?? null,
                        'followers'      => $u->followers_count,
                        'following'      => $u->following_count,
                        'tweets_count'   => $u->tweets_count,
                        'is_following'   => $authUser ? $authUser->follows($u) : false,
                        'is_self'        => $authUser ? $authUser->id === $u->id : false,
                    ];
                });
        } else {
            $tweetsRaw = collect();
            $usersRaw  = collect();
        }

        return inertia('Search', [
            'query'  => $query,
            'tweets' => $tweetsRaw,
            'users'  => $usersRaw,
            'trends' => $this->getTrends(),
        ]);
    }
}
