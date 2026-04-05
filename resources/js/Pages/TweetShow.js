import { Icons, ReplyModal } from '../components/icons.js';

export default function TweetShow(props) {
    const user = props.auth.user;
    const tweet = props.tweet;

    window._isLoggedIn = !!user;
    window._currentUserAvatar = user?.avatar || `https://i.pravatar.cc/150?u=${user?.id || 'me'}`;
    window._currentUserName = user?.name || null;
    window._currentUserHandle = user ? '@' + user.name.toLowerCase().replace(/\s+/g, '') : null;

    const userData = JSON.stringify({
        name: user?.name || 'Guest',
        handle: user ? '@' + user.name.toLowerCase().replace(/\s+/g, '') : '@guest',
        avatar: user?.avatar || `https://i.pravatar.cc/150?u=${user?.id || 'guest'}`,
        id: user?.id || null
    }).replace(/"/g, '&quot;');

    const tweetData = JSON.stringify(tweet).replace(/"/g, '&quot;');
    const repliesData = JSON.stringify(tweet.replies_list || []).replace(/"/g, '&quot;');
    const trendsData = JSON.stringify(props.trends || []).replace(/"/g, '&quot;');
    const whoToFollowData = JSON.stringify(props.whoToFollow || []).replace(/"/g, '&quot;');

    return `
    <div x-data="{
        currentUser: ${userData},
        tweet: ${tweetData},
        replies: ${repliesData},
        replyBody: '',
        liked: ${!!tweet.liked_by_user},
        likeCount: ${tweet.likes || 0},
        retweeted: ${!!tweet.retweeted_by_user},
        retweetCount: ${tweet.retweets || 0},
        isLoggedIn: ${!!user},
        unread_count: ${props.auth.unread_notifications_count || 0},
        trends: ${trendsData},
        whoToFollow: ${whoToFollowData},
        followingMap: {},
        loading: false,
        showComposeModal: false,
        modalTweetContent: '',

        init() {
            this.whoToFollow.forEach(u => { this.followingMap[u.id] = u.is_following; });
            
            // Polling for unreads
            if (this.isLoggedIn) {
                setInterval(() => {
                    axios.get('/notifications/unread-count')
                        .then(res => { this.unread_count = res.data.count; })
                        .catch(() => {});
                }, 15000);
            }
        },

        postTweet(body) {
            if (!body.trim() || this.loading) return;
            this.loading = true;
            axios.post('/tweets', { body })
                .then(() => {
                    this.showComposeModal = false;
                    this.modalTweetContent = '';
                    window.location.href = '/dashboard'; // Redirect to see the new tweet
                })
                .catch(err => {
                    alert(err.response?.data?.message || 'Error posting tweet');
                })
                .finally(() => { this.loading = false; });
        },

        toggleFollow(userId) {
            if (!this.isLoggedIn) { window.location.href = '/login'; return; }
            const prev = this.followingMap[userId];
            this.followingMap[userId] = !prev;

            axios.post('/users/' + userId + '/follow')
                .then(res => { 
                    this.followingMap[userId] = res.data.following;
                    const userObj = this.whoToFollow.find(u => u.id === userId);
                    if (userObj) userObj.followers = res.data.followers_count;
                })
                .catch(() => { this.followingMap[userId] = prev; });
        },
        toggleLike() {
            if (!this.isLoggedIn) { window.location.href = '/login'; return; }
            this.liked = !this.liked;
            this.likeCount += this.liked ? 1 : -1;
            axios.post('/tweets/' + this.tweet.id + '/like')
                .then(res => { this.liked = res.data.liked; this.likeCount = res.data.likes_count; })
                .catch(() => { this.liked = !this.liked; this.likeCount += this.liked ? 1 : -1; });
        },
        toggleRetweet() {
            if (!this.isLoggedIn) { window.location.href = '/login'; return; }
            this.retweeted = !this.retweeted;
            this.retweetCount += this.retweeted ? 1 : -1;
            axios.post('/tweets/' + this.tweet.id + '/retweet')
                .then(res => { this.retweeted = res.data.retweeted; this.retweetCount = res.data.retweets_count; })
                .catch(() => { this.retweeted = !this.retweeted; this.retweetCount += this.retweeted ? 1 : -1; });
        },
        submitReply() {
            if (!this.replyBody.trim() || this.loading || !this.isLoggedIn) return;
            this.loading = true;
            axios.post('/tweets/' + this.tweet.id + '/reply', { body: this.replyBody })
                .then(res => {
                    this.replies.unshift({
                        id: res.data.reply_id || Date.now(),
                        user: this.currentUser.name,
                        handle: this.currentUser.handle,
                        avatar: this.currentUser.avatar,
                        body: this.replyBody,
                        time: 'now',
                        likes: 0,
                        liked_by_user: false,
                    });
                    this.tweet.replies = (this.tweet.replies || 0) + 1;
                    this.replyBody = '';
                })
                .catch(err => {
                    const msg = err.response?.data?.errors?.body?.[0] || 'Something went wrong';
                    alert(msg);
                })
                .finally(() => { this.loading = false; });
        }
    }" class="flex min-h-screen w-full bg-black text-zinc-100 font-sans">

        <div class="flex w-full max-w-[1300px] mx-auto">

            <!-- Sidebar -->
            <aside class="w-[72px] xl:w-[275px] flex flex-col items-center xl:items-start p-2 sm:p-4 sticky top-0 h-screen overflow-y-auto shrink-0">
                <div class="hover:bg-zinc-900 rounded-full p-3 transition mb-2">
                    ${Icons.twitter}
                </div>
                <nav class="flex-1 space-y-1 w-full text-zinc-100">
                    <a href="/" class="flex items-center space-x-5 p-3 hover:bg-zinc-900 rounded-full transition group w-fit">
                        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                        <span class="text-xl hidden xl:inline pr-4">Home</span>
                    </a>

                    <a href="/search" class="flex items-center space-x-5 p-3 hover:bg-zinc-900 rounded-full transition-all duration-200 w-fit">
                        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>
                        <span class="text-xl hidden xl:inline pr-4">Explore</span>
                    </a>
                    
                    <a href="/notifications" class="flex items-center space-x-5 p-3 hover:bg-zinc-900 rounded-full transition-all duration-200 w-fit relative group">
                        <div class="relative">
                            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/></svg>
                            <template x-if="unread_count > 0">
                                <span class="absolute -top-1 -right-1 bg-[#1d9bf0] text-zinc-100 text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-black" x-text="unread_count"></span>
                            </template>
                        </div>
                        <span class="text-xl hidden xl:inline pr-4">Notifications</span>
                    </a>

                    <div x-show="isLoggedIn" class="pt-4">
                        <button @click="showComposeModal = true" class="bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white w-full xl:w-[90%] py-4 rounded-full font-bold text-xl transition-all shadow-lg hover:shadow-xl transform active:scale-95 flex items-center justify-center">
                            <span class="hidden xl:inline">Post</span>
                            <svg class="w-6 h-6 xl:hidden" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-1.007.07-2.012.19-3H12c4.1 0 7.48-3.082 7.94-7.054C22.79 10.147 23.17 6.359 23 3zm-7 8h-1.5v2H14.5V11z" /></svg>
                        </button>
                    </div>

                    <template x-if="!isLoggedIn">
                        <div class="space-y-4 mt-8">
                            <a href="/login" class="flex items-center justify-center border border-zinc-700 hover:bg-zinc-800 text-white font-bold py-3 px-4 rounded-full transition w-full xl:block hidden text-center">Log in</a>
                            <a href="/register" class="flex items-center justify-center bg-white hover:bg-zinc-200 text-black font-bold py-3 px-4 rounded-full transition w-full xl:block hidden text-center">Register</a>
                        </div>
                    </template>
                </nav>
                <div x-show="isLoggedIn" class="mt-auto p-3 hover:bg-zinc-900 rounded-full transition flex items-center xl:space-x-3 w-fit xl:w-full cursor-pointer">
                    <img :src="currentUser.avatar" class="w-10 h-10 rounded-full" alt="">
                    <div class="hidden xl:block flex-1 min-w-0">
                        <p class="font-bold text-sm truncate" x-text="currentUser.name"></p>
                        <p class="text-zinc-500 text-sm truncate" x-text="currentUser.handle"></p>
                    </div>
                </div>
            </aside>

            <!-- Main Content -->
            <main class="flex-1 min-w-0 border-x border-zinc-800 xl:max-w-[600px]">

                <!-- Header with back button -->
                <div class="sticky top-0 bg-black/80 backdrop-blur-xl border-b border-zinc-800 z-50 flex items-center space-x-6 p-4">
                    <button onclick="history.back()" class="p-2 hover:bg-zinc-900 rounded-full transition">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                    </button>
                    <h1 class="text-xl font-bold">Post</h1>
                </div>

                <!-- The Tweet (large format like Twitter) -->
                <article class="p-4 border-b border-zinc-800">
                    <!-- Author row -->
                    <div class="flex items-center space-x-3 mb-3">
                        <img :src="tweet.avatar" class="w-12 h-12 rounded-full object-cover" alt="">
                        <div>
                            <p class="font-bold text-base" x-text="tweet.user"></p>
                            <p class="text-zinc-500 text-sm" x-text="tweet.handle"></p>
                        </div>
                    </div>

                    <!-- Tweet body (large) -->
                    <p class="text-[1.4rem] leading-snug text-zinc-100 whitespace-pre-wrap break-words mb-4" x-text="tweet.content"></p>

                    <!-- Full timestamp -->
                    <p class="text-zinc-500 text-sm border-b border-zinc-800 pb-3 mb-3" x-text="tweet.created_at_full || tweet.time"></p>

                    <!-- Stats row -->
                    <div class="flex items-center space-x-5 text-sm border-b border-zinc-800 pb-3 mb-3">
                        <span><strong x-text="retweetCount" class="text-zinc-100"></strong> <span class="text-zinc-500">Reposts</span></span>
                        <span><strong x-text="tweet.replies" class="text-zinc-100"></strong> <span class="text-zinc-500">Replies</span></span>
                        <span><strong x-text="likeCount" class="text-zinc-100"></strong> <span class="text-zinc-500">Likes</span></span>
                    </div>

                    <!-- Action icons row (large) -->
                    <div class="flex items-center justify-around py-1 border-b border-zinc-800 text-zinc-500">
                        <!-- Reply -->
                        <button
                            @click="if (!isLoggedIn) { window.location.href = '/login'; return; } $dispatch('open-reply-modal', { tweet, onSuccess: (r) => { if(r) replies.unshift(r); tweet.replies++; } })"
                            class="p-3 hover:bg-blue-500/10 rounded-full hover:text-blue-400 transition"
                        >${Icons.reply}</button>

                        <!-- Retweet -->
                        <button
                            @click="toggleRetweet()"
                            :class="retweeted ? 'text-green-400 bg-green-500/10' : 'hover:bg-green-500/10 hover:text-green-400'"
                            class="p-3 rounded-full transition"
                        >${Icons.retweet}</button>

                        <!-- Like -->
                        <button
                            @click="toggleLike()"
                            :class="liked ? 'text-pink-500 bg-pink-500/10' : 'hover:bg-pink-500/10 hover:text-pink-400'"
                            class="p-3 rounded-full transition"
                        >
                            <svg class="w-[22px] h-[22px]" fill="none" :fill="liked ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"/>
                            </svg>
                        </button>

                        <!-- Share -->
                        <button class="p-3 hover:bg-blue-500/10 rounded-full hover:text-blue-400 transition">${Icons.share}</button>
                    </div>
                </article>

                <!-- Reply Compose (only if logged in) -->
                <div x-show="isLoggedIn" class="flex space-x-3 p-4 border-b border-zinc-800">
                    <img :src="currentUser.avatar" class="w-10 h-10 rounded-full shrink-0 object-cover" alt="">
                    <div class="flex-1">
                        <textarea
                            x-model="replyBody"
                            @keydown.meta.enter="submitReply()"
                            @keydown.ctrl.enter="submitReply()"
                            class="bg-transparent border-none focus:ring-0 w-full text-xl resize-none placeholder-zinc-500 min-h-[80px]"
                            placeholder="Post your reply"
                        ></textarea>
                        <div class="flex justify-between items-center pt-2 border-t border-zinc-800">
                            <span class="text-sm" :class="replyBody.length > 260 ? 'text-red-400' : 'text-zinc-500'" x-text="replyBody.length + '/280'"></span>
                            <button
                                @click="submitReply()"
                                :disabled="!replyBody.trim() || loading || replyBody.length > 280"
                                class="bg-[#1d9bf0] disabled:opacity-50 text-white px-5 py-2 rounded-full font-bold hover:bg-[#1a8cd8] transition flex items-center space-x-2"
                            >
                                <span x-show="loading" class="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></span>
                                <span x-text="loading ? 'Replying...' : 'Reply'"></span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Replies List -->
                <div class="divide-y divide-zinc-800">
                    <template x-for="reply in replies" :key="reply.id">
                        <div class="p-4 hover:bg-white/[0.03] transition flex space-x-3">
                            <img :src="reply.avatar || 'https://i.pravatar.cc/150?u=' + reply.id" class="w-10 h-10 rounded-full shrink-0 object-cover" alt="">
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center space-x-1 flex-wrap">
                                    <span class="font-bold hover:underline" x-text="reply.user"></span>
                                    <span class="text-zinc-500 text-sm" x-text="reply.handle"></span>
                                    <span class="text-zinc-500 text-sm">·</span>
                                    <span class="text-zinc-500 text-sm" x-text="reply.time || 'now'"></span>
                                </div>
                                <p class="mt-1 text-zinc-100 whitespace-pre-wrap break-words" x-text="reply.body"></p>
                                <!-- Replying to hint -->
                                <p class="text-zinc-500 text-xs mt-1">Replying to <span class="text-[#1d9bf0]" x-text="tweet.handle"></span></p>

                                <!-- Reply like button -->
                                <div x-data="{
                                    liked: reply.liked_by_user ?? false,
                                    count: reply.likes ?? 0,
                                    toggle() {
                                        if (!window._isLoggedIn) { window.location.href='/login'; return; }
                                        this.liked = !this.liked;
                                        this.count += this.liked ? 1 : -1;
                                        axios.post('/tweets/' + reply.id + '/like')
                                            .then(res => { this.liked = res.data.liked; this.count = res.data.likes_count; })
                                            .catch(() => { this.liked = !this.liked; this.count += this.liked ? 1 : -1; });
                                    }
                                }" class="flex items-center space-x-4 mt-3 text-zinc-500">
                                    <button @click="toggle()" :class="liked ? 'text-pink-500' : 'hover:text-pink-400'" class="flex items-center space-x-1 transition">
                                        <div class="p-1.5 rounded-full" :class="liked ? 'bg-pink-500/10' : 'hover:bg-pink-500/10'">
                                            <svg class="w-4 h-4" fill="none" :fill="liked ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"/>
                                            </svg>
                                        </div>
                                        <span x-text="count" class="text-xs"></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </template>

                    <!-- Empty state -->
                    <div x-show="replies.length === 0" class="p-12 text-center text-zinc-500">
                        <p class="text-xl font-bold text-zinc-100 mb-2">No replies yet</p>
                        <p class="text-sm">Be the first to reply to this post.</p>
                    </div>
                </div>
            </main>

            <!-- Right Sidebar -->
            <aside class="hidden lg:block w-[350px] p-4 space-y-4 shrink-0">
                <!-- Auth (Guest) -->
                <template x-if="!isLoggedIn">
                    <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
                        <h2 class="text-xl font-bold">New to Flock?</h2>
                        <p class="text-zinc-400 text-sm">Sign up to follow people and see their posts in your timeline.</p>
                        <a href="/register" class="bg-[#1d9bf0] text-white w-full block text-center font-bold py-2 rounded-full hover:bg-[#1a8cd8] transition">Create account</a>
                        <a href="/login" class="border border-zinc-600 text-white w-full block text-center font-bold py-2 rounded-full hover:bg-zinc-800 transition">Sign in</a>
                    </div>
                </template>

                <!-- Who to follow (logged-in) -->
                <template x-if="isLoggedIn">
                    <div class="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                        <h2 class="text-xl font-bold p-4 pb-2">Who to follow</h2>
                        <div class="divide-y divide-zinc-800/60" x-show="whoToFollow.length > 0">
                            <template x-for="u in whoToFollow" :key="u.id">
                                <div class="flex items-center space-x-3 px-4 py-3 hover:bg-white/[0.03] transition group">
                                    <a :href="#" class="shrink-0">
                                        <img :src="u.avatar" class="w-10 h-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-[#1d9bf0]/20 transition" alt="">
                                    </a>
                                    <div class="flex-1 min-w-0">
                                        <a :href="#" class="font-bold text-sm hover:underline truncate block" x-text="u.name"></a>
                                        <span class="text-zinc-500 text-xs truncate block" x-text="u.handle"></span>
                                        <span class="text-zinc-600 text-xs" x-text="u.followers + ' followers'"></span>
                                    </div>
                                    <button
                                        @click="toggleFollow(u.id)"
                                        :class="followingMap[u.id]
                                            ? 'border border-zinc-600 text-zinc-100 hover:border-red-500 hover:text-red-400 hover:bg-red-500/5'
                                            : 'bg-zinc-100 text-black hover:bg-white'"
                                        class="px-4 py-1.5 rounded-full font-bold text-sm transition-all duration-200 shrink-0"
                                        x-text="followingMap[u.id] ? 'Following' : 'Follow'"
                                    ></button>
                                </div>
                            </template>
                        </div>
                        <div x-show="whoToFollow.length === 0" class="px-4 py-5 text-zinc-500 text-sm">
                            You&apos;re all caught up!
                        </div>
                        <a href="/search" class="block px-4 py-3 text-[#1d9bf0] text-sm hover:bg-zinc-800 transition rounded-b-2xl border-t border-zinc-800/60">
                            Show more people
                        </a>
                    </div>
                </template>

                <!-- Trends -->
                <div class="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                    <h2 class="text-xl font-bold p-4">Trends for you</h2>
                    <div class="divide-y divide-zinc-800">
                        <template x-for="(trend, index) in trends" :key="index">
                            <a :href="'/search?q=' + encodeURIComponent(trend.tag)" class="px-4 py-3 hover:bg-zinc-800 transition cursor-pointer flex justify-between items-start block text-inherit no-underline">
                                <div>
                                    <p class="text-zinc-500 text-xs">Trending in Technology</p>
                                    <p class="font-bold" x-text="trend.tag"></p>
                                    <p class="text-zinc-500 text-xs" x-text="trend.label"></p>
                                </div>
                                <span class="text-zinc-600 text-xs mt-1" x-text="'#' + (index + 1)"></span>
                            </a>
                        </template>
                    </div>
                </div>
            </aside>
        </div>

        ${ReplyModal()}

        <!-- Compose Modal (logged-in only) -->
        <div
            x-show="showComposeModal"
            class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
            x-transition:enter="transition ease-out duration-200"
            x-transition:enter-start="opacity-0"
            x-transition:enter-end="opacity-100"
            x-transition:leave="transition ease-in duration-200"
            x-transition:leave-start="opacity-100"
            x-transition:leave-end="opacity-0"
            style="display:none"
        >
            <div @click.away="showComposeModal = false" class="bg-black w-full max-w-[600px] max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-zinc-800 flex flex-col">
                <div class="p-4 flex items-center border-b border-zinc-800 sticky top-0 bg-black z-10">
                    <button @click="showComposeModal = false" class="p-2 hover:bg-zinc-900 rounded-full transition text-zinc-100">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                    <div class="ml-auto">
                        <button 
                            @click="postTweet(modalTweetContent)"
                            :disabled="!modalTweetContent.trim() || loading"
                            class="xl:hidden bg-[#1d9bf0] disabled:opacity-50 text-white px-4 py-1.5 rounded-full font-bold text-sm"
                        >
                            Post
                        </button>
                    </div>
                </div>
                <div class="p-4 flex space-x-3 overflow-y-auto flex-1">
                    <img :src="currentUser.avatar" class="w-10 h-10 rounded-full shrink-0 border border-zinc-900" alt="">
                    <div class="flex-1">
                        <textarea
                            x-model="modalTweetContent"
                            class="bg-transparent border-none focus:ring-0 w-full text-xl resize-none placeholder-zinc-500 min-h-[120px]"
                            placeholder="What's happening?"
                            autofocus
                        ></textarea>
                        <div class="mt-4 pt-3 border-t border-zinc-800 flex justify-between items-center">
                            <div class="flex space-x-3 text-[#1d9bf0]">
                                <div class="p-2 hover:bg-blue-500/10 rounded-full cursor-pointer transition">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12.75a1.5 1.5 0 001.5 1.5zm10.5-112.5h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/></svg>
                                </div>
                            </div>
                            <button
                                @click="postTweet(modalTweetContent)"
                                :disabled="!modalTweetContent.trim() || loading"
                                class="bg-[#1d9bf0] disabled:opacity-50 text-white px-5 py-2 rounded-full font-bold hover:bg-[#1a8cd8] transition flex items-center space-x-2"
                            >
                                <span x-show="loading" class="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></span>
                                <span x-text="loading ? 'Posting...' : 'Post'"></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}
