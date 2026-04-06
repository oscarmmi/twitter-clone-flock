import { Icons, TweetCard, ReplyModal } from '../components/icons.js';

export default function Search(props) {
    const user    = props.auth.user;
    const query   = props.query   || '';
    const tweets  = props.tweets  || [];
    const users   = props.users   || [];
    const trends  = props.trends  || [];

    // Globals used by TweetCard / ReplyModal
    window._isLoggedIn        = !!user;
    window._currentUserAvatar = user?.avatar || `https://i.pravatar.cc/150?u=${user?.id || 'me'}`;
    window._currentUserName   = user?.name   || null;
    window._currentUserHandle = user ? '@' + user.name.toLowerCase().replace(/\s+/g, '') : null;

    const userData = JSON.stringify({
        name:   user?.name   || 'Guest',
        handle: user ? '@' + user.name.toLowerCase().replace(/\s+/g, '') : '@guest',
        avatar: user?.avatar || `https://i.pravatar.cc/150?u=${user?.id || 'guest'}`,
        id:     user?.id     || null,
    }).replace(/"/g, '&quot;');

    const tweetsData = JSON.stringify(tweets).replace(/"/g, '&quot;');
    const usersData  = JSON.stringify(users).replace(/"/g, '&quot;');
    const trendsData = JSON.stringify(trends).replace(/"/g, '&quot;');
    const queryEsc   = query.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    return `
    <div x-data="{
        activeTab: 'people',
        searchQuery: '${queryEsc}',
        tweets: ${tweetsData},
        users:  ${usersData},
        trends: ${trendsData},
        user:   ${userData},
        isLoggedIn: ${!!user},
        unread_count: ${props.auth.unread_notifications_count || 0},
        followingMap: {},

        init() {
            /* Build a reactive follow-state map keyed by user id */
            this.users.forEach(u => {
                this.followingMap[u.id] = u.is_following;
            });

            // Polling for unread notifications every 15 seconds
            if (this.isLoggedIn) {
                setInterval(() => {
                    axios.get('/notifications/unread-count')
                        .then(res => { this.unread_count = res.data.count; })
                        .catch(() => {});
                }, 15000);
            }
        },

        submitSearch(e) {
            e && e.preventDefault();
            const q = this.searchQuery.trim();
            if (q) window.location.href = '/search?q=' + encodeURIComponent(q);
        },

        toggleFollow(userId) {
            if (!this.isLoggedIn) { window.location.href = '/login'; return; }
            const prev = this.followingMap[userId];
            this.followingMap[userId] = !prev;
            axios.post('/users/' + userId + '/follow')
                .then(res => { this.followingMap[userId] = res.data.following; })
                .catch(() => { this.followingMap[userId] = prev; });
        },

        logout() {
            axios.post('/logout')
                .then(() => window.location.href = '/')
                .catch(() => window.location.href = '/');
        }
    }" class="flex min-h-screen w-full bg-black text-zinc-100 font-sans selection:bg-blue-500/30">

        <div class="flex w-full max-w-[1300px] mx-auto">

            <!-- ── Sidebar ── -->
            <aside class="w-[72px] xl:w-[275px] flex flex-col items-center xl:items-start p-2 sm:p-4 sticky top-0 h-screen overflow-y-auto shrink-0 transition-all">

                <!-- Logo -->
                <a href="${user ? '/dashboard' : '/'}" class="hover:bg-zinc-900 rounded-full p-3 transition mb-2 block w-fit">
                    <svg class="w-8 h-8 fill-zinc-100" viewBox="0 0 24 24"><path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"/></svg>
                </a>

                <!-- Nav links -->
                <nav class="flex-1 space-y-1 w-full text-zinc-100">
                    <a href="${user ? '/dashboard' : '/'}" class="flex items-center space-x-5 p-3 hover:bg-zinc-900 rounded-full transition-all duration-200 w-fit font-bold">
                        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                        <span class="text-xl hidden xl:inline pr-4">Home</span>
                    </a>
                    <a href="#" class="flex items-center space-x-5 p-3 bg-zinc-900/60 rounded-full transition-all duration-200 w-fit font-bold text-[#1d9bf0]">
                        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>
                        <span class="text-xl hidden xl:inline pr-4 text-zinc-100">Explore</span>
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
                </nav>

                <!-- Auth buttons (guest) -->
                <template x-if="!isLoggedIn">
                    <div class="w-full space-y-3 mt-4 mb-4">
                        <a href="/login" class="flex items-center justify-center bg-transparent border border-zinc-700 hover:bg-zinc-900 text-white font-bold py-3 px-4 rounded-full transition-all duration-200 w-full text-center">
                            <span class="hidden xl:inline">Log in</span>
                            <svg class="w-6 h-6 xl:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/></svg>
                        </a>
                        <a href="/register" class="flex items-center justify-center bg-white hover:bg-zinc-200 text-black font-bold py-3 px-4 rounded-full transition-all duration-200 w-full text-center">
                            <span class="hidden xl:inline">Register</span>
                            <svg class="w-6 h-6 xl:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
                        </a>
                    </div>
                </template>

                <!-- User pill (logged in) -->
                <div
                    x-show="isLoggedIn"
                    x-data="{ open: false }"
                    @click="open = !open"
                    class="mt-auto p-3 hover:bg-zinc-900 rounded-full transition flex items-center xl:space-x-3 w-fit xl:w-full cursor-pointer group relative"
                >
                    <img :src="user.avatar" class="w-10 h-10 rounded-full" :alt="user.name">
                    <div class="hidden xl:block flex-1 min-w-0">
                        <p class="font-bold text-sm truncate" x-text="user.name"></p>
                        <p class="text-zinc-500 text-sm truncate" x-text="user.handle"></p>
                    </div>
                    <div class="hidden xl:block ml-auto text-zinc-500">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/></svg>
                    </div>
                    <!-- Logout dropdown -->
                    <div
                        x-show="open" x-transition
                        @click.away="open = false"
                        class="absolute bottom-full left-0 w-full mb-2 bg-black border border-zinc-800 rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.1)] overflow-hidden z-50"
                    >
                        <button @click="logout()" class="w-full text-left p-4 hover:bg-zinc-900 transition font-bold text-sm">
                            Log out <span x-text="user.handle"></span>
                        </button>
                    </div>
                </div>
            </aside>

            <!-- ── Main Search Panel ── -->
            <main class="flex-1 min-w-0 border-x border-zinc-800 xl:max-w-[600px]">

                <!-- Sticky search bar at top -->
                <div class="sticky top-0 bg-black/80 backdrop-blur-xl z-50 px-4 pt-3 pb-0 border-b border-zinc-800">
                    <form @submit.prevent="submitSearch($event)" class="flex items-center space-x-3 bg-zinc-900 px-4 py-2.5 rounded-full border border-transparent focus-within:border-[#1d9bf0] focus-within:bg-black transition group mb-3">
                        <svg class="w-5 h-5 text-zinc-500 group-focus-within:text-[#1d9bf0] shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/></svg>
                        <input
                            id="search-input"
                            type="text"
                            x-model="searchQuery"
                            @keydown.enter.prevent="submitSearch()"
                            placeholder="Search Flock"
                            class="bg-transparent border-none focus:ring-0 w-full placeholder-zinc-500 text-zinc-100"
                            autofocus
                        >
                        <!-- Clear button -->
                        <button
                            type="button"
                            x-show="searchQuery.length > 0"
                            @click="searchQuery = ''; $el.previousElementSibling.focus()"
                            class="text-zinc-500 hover:text-zinc-300 transition shrink-0"
                        >
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                        </button>
                    </form>

                    <!-- Tabs -->
                    <div x-show="searchQuery.length > 0 || tweets.length > 0 || users.length > 0" class="flex text-zinc-500 font-bold">
                        <button @click="activeTab = 'people'" class="flex-1 hover:bg-zinc-900/50 py-3.5 transition relative">
                            <span :class="activeTab === 'people' ? 'text-zinc-100' : ''">People</span>
                            <div x-show="activeTab === 'people'" class="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-[#1d9bf0] rounded-full"></div>
                        </button>
                        <button @click="activeTab = 'tweets'" class="flex-1 hover:bg-zinc-900/50 py-3.5 transition relative">
                            <span :class="activeTab === 'tweets' ? 'text-zinc-100' : ''">Posts</span>
                            <div x-show="activeTab === 'tweets'" class="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-[#1d9bf0] rounded-full"></div>
                        </button>
                    </div>
                </div>

                <!-- ── Empty / no-query state ── -->
                <div x-show="!searchQuery && tweets.length === 0 && users.length === 0" class="flex flex-col items-center justify-center py-24 px-8 text-center">
                    <div class="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-5">
                        <svg class="w-8 h-8 text-[#1d9bf0]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>
                    </div>
                    <h2 class="text-2xl font-extrabold mb-2">Search Flock</h2>
                    <p class="text-zinc-500 text-base max-w-xs">Try searching for people, topics, or keywords to discover content on Flock.</p>
                </div>

                <!-- ── No results state ── -->
                <div x-show="searchQuery && tweets.length === 0 && users.length === 0" class="flex flex-col items-center justify-center py-24 px-8 text-center">
                    <div class="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-5">
                        <svg class="w-8 h-8 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>
                    </div>
                    <h2 class="text-2xl font-extrabold mb-2">No results for "<span class="text-[#1d9bf0]" x-text="searchQuery"></span>"</h2>
                    <p class="text-zinc-500 text-base max-w-xs">Try searching for something else, or check your spelling.</p>
                </div>

                <!-- ── People tab ── -->
                <div x-show="activeTab === 'people' && (users.length > 0)">
                    <template x-for="u in users" :key="u.id">
                        <div class="flex items-start space-x-3 px-4 py-4 hover:bg-white/[0.03] transition border-b border-zinc-800 group">
                            <!-- Avatar -->
                            <a :href="'/u/' + u.id" class="shrink-0">
                                <img :src="u.avatar || 'https://i.pravatar.cc/150?u=' + u.id" class="w-11 h-11 rounded-full object-cover ring-2 ring-transparent group-hover:ring-[#1d9bf0]/30 transition" alt="">
                            </a>
                            <!-- Info -->
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center justify-between flex-wrap gap-2">
                                    <div class="min-w-0">
                                        <a :href="'/u/' + u.id" class="font-bold hover:underline truncate block" x-text="u.name"></a>
                                        <span class="text-zinc-500 text-sm truncate block" x-text="u.handle"></span>
                                    </div>
                                    <!-- Follow / Unfollow button -->
                                    <div x-show="!u.is_self">
                                        <button
                                            @click="toggleFollow(u.id)"
                                            :class="followingMap[u.id]
                                                ? 'border border-zinc-600 text-zinc-100 hover:border-red-500 hover:text-red-400 hover:bg-red-500/5'
                                                : 'bg-zinc-100 text-black hover:bg-white'"
                                            class="px-4 py-1.5 rounded-full font-bold text-sm transition-all duration-200 shrink-0"
                                            x-text="followingMap[u.id] ? 'Following' : 'Follow'"
                                        ></button>
                                    </div>
                                    <div x-show="u.is_self">
                                        <span class="text-xs text-zinc-500 border border-zinc-700 px-3 py-1 rounded-full">You</span>
                                    </div>
                                </div>
                                <!-- Bio -->
                                <p x-show="u.bio" class="text-sm text-zinc-300 mt-1 line-clamp-2" x-text="u.bio"></p>
                                <!-- Stats -->
                                <div class="flex items-center space-x-4 mt-2 text-zinc-500 text-xs">
                                    <span><strong class="text-zinc-200" x-text="u.followers"></strong> Followers</span>
                                    <span><strong class="text-zinc-200" x-text="u.tweets_count"></strong> Posts</span>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>

                <!-- People empty (query exists but no user hits) -->
                <div x-show="activeTab === 'people' && users.length === 0 && (tweets.length > 0)" class="py-16 text-center px-8">
                    <p class="text-xl font-bold mb-2">No people found</p>
                    <p class="text-zinc-500 text-sm">Try a different keyword or check the Posts tab.</p>
                </div>

                <!-- ── Tweets tab ── -->
                <div x-show="activeTab === 'tweets' && tweets.length > 0" class="divide-y divide-zinc-800">
                    ${TweetCard()}
                </div>

                <!-- Tweets empty -->
                <div x-show="activeTab === 'tweets' && tweets.length === 0 && users.length > 0" class="py-16 text-center px-8">
                    <p class="text-xl font-bold mb-2">No posts found</p>
                    <p class="text-zinc-500 text-sm">No one has posted about this yet. Check the People tab.</p>
                </div>

            </main>

            <!-- ── Right Sidebar ── -->
            <aside class="hidden lg:block w-[350px] p-4 space-y-4 shrink-0">

                <!-- Who to follow (guests) -->
                <template x-if="!isLoggedIn">
                    <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
                        <h2 class="text-xl font-bold">New to Flock?</h2>
                        <p class="text-zinc-400 text-sm">Sign up to follow people and see their posts in your timeline.</p>
                        <a href="/register" class="bg-[#1d9bf0] text-white w-full block text-center font-bold py-2 rounded-full hover:bg-[#1a8cd8] transition">Create account</a>
                        <a href="/login" class="border border-zinc-600 text-white w-full block text-center font-bold py-2 rounded-full hover:bg-zinc-800 transition">Sign in</a>
                    </div>
                </template>

                <!-- Trends -->
                <div class="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                    <h2 class="text-xl font-bold p-4">Trends for you</h2>
                    <div class="divide-y divide-zinc-800">
                        <template x-for="(trend, index) in trends" :key="index">
                            <a :href="'/search?q=' + encodeURIComponent(trend.tag)" class="px-4 py-3 hover:bg-zinc-800 transition cursor-pointer flex justify-between items-start block">
                                <div>
                                    <p class="text-zinc-500 text-xs">Trending in Technology</p>
                                    <p class="font-bold" x-text="trend.tag"></p>
                                    <p class="text-zinc-500 text-xs" x-text="trend.label"></p>
                                </div>
                                <span class="text-zinc-600 text-xs mt-1" x-text="'#' + (index + 1)"></span>
                            </a>
                        </template>
                        <div x-show="trends.length === 0" class="px-4 py-6 text-center text-zinc-500 text-sm">No trends yet</div>
                    </div>
                </div>
            </aside>
        </div>

        ${ReplyModal()}
    </div>
    `;
}
