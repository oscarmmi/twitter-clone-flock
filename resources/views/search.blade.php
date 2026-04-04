<x-app-layout>
    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <!-- Sidebar (Left) -->
                <div class="md:col-span-1">
                    <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 class="font-bold text-lg mb-4">Search Results</h3>
                        <p class="text-gray-500">Query: <span class="font-bold text-black">{{ $query }}</span></p>
                    </div>
                </div>

                <!-- Feed (Center) -->
                <div class="md:col-span-2 text-bal">
                    <div class="mb-6">
                        <form action="{{ route('search') }}" method="GET">
                            <input type="text" name="q" value="{{ $query }}" placeholder="Search tweets..." class="w-full border-gray-300 rounded-md shadow-sm px-4 py-3 text-lg">
                        </form>
                    </div>

                    <!-- Timeline -->
                    <div class="space-y-4">
                        @forelse($tweets as $tweet)
                            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-b border-gray-100">
                                <div class="flex items-start">
                                    <div class="mr-4">
                                        <div class="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                                            {{ strtoupper(substr($tweet->user->name, 0, 1)) }}
                                        </div>
                                    </div>
                                    <div class="flex-1">
                                        <div class="flex items-center mb-1">
                                            <a href="{{ route('user.show', $tweet->user) }}" class="font-bold hover:underline mr-2">{{ $tweet->user->name }}</a>
                                            <span class="text-gray-500 text-sm">· {{ $tweet->created_at->diffForHumans() }}</span>
                                        </div>
                                        <p class="text-gray-800">{{ $tweet->body }}</p>

                                        <!-- Actions -->
                                        <div class="flex items-center mt-4 space-x-8 text-gray-500">
                                            <button class="flex items-center space-x-2">
                                                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                                                <span>{{ $tweet->replies->count() }}</span>
                                            </button>

                                            <form action="{{ route('tweets.retweet', $tweet) }}" method="POST">
                                                @csrf
                                                <button type="submit" class="flex items-center space-x-2 hover:text-green-500 transition">
                                                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                                    <span>{{ $tweet->retweets->count() }}</span>
                                                </button>
                                            </form>

                                            <form action="{{ route('tweets.like', $tweet) }}" method="POST">
                                                @csrf
                                                <button type="submit" class="flex items-center space-x-2 {{ Auth::user()->likesTweet($tweet) ? 'text-red-500' : 'hover:text-red-500' }} transition">
                                                    <svg class="h-5 w-5" fill="{{ Auth::user()->likesTweet($tweet) ? 'currentColor' : 'none' }}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                                    <span>{{ $tweet->likes->count() }}</span>
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        @empty
                            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                                <p class="text-center text-gray-500">No matching tweets found.</p>
                            </div>
                        @endforelse
                    </div>
                </div>

                <!-- Right (Optional) -->
                <div class="md:col-span-1"></div>
            </div>
        </div>
    </div>
</x-app-layout>
