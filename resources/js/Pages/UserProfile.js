import { Icons, ReplyModal } from '../components/icons.js';

export default function UserProfile(props) {
    const user = props.auth.user;
    const profileUser = props.profileUser;
    const tweets = props.tweets;

    const userData = JSON.stringify({
        name: user?.name || 'Guest',
        handle: user ? '@' + user.name.toLowerCase().replace(/\s+/g, '') : '@guest',
        avatar: user?.avatar || `https://i.pravatar.cc/150?u=${user?.id || 'guest'}`,
        id: user?.id || null
    }).replace(/"/g, '&quot;');

    const profileData = JSON.stringify(profileUser).replace(/"/g, '&quot;');
    const tweetsData = JSON.stringify(tweets || []).replace(/"/g, '&quot;');
    const trendsData = JSON.stringify(props.trends || []).replace(/"/g, '&quot;');
    const whoToFollowData = JSON.stringify(props.whoToFollow || []).replace(/"/g, '&quot;');

    return `
    <div x-data="{
        currentUser: ${userData},
        profile: ${profileData},
        tweets: ${tweetsData},
        trends: ${trendsData},
        whoToFollow: ${whoToFollowData},
        isLoggedIn: ${!!user},
        unread_count: ${props.auth.unread_notifications_count || 0},
        followingMap: {},
        isFollowingProfile: ${!!profileUser.is_following},
        followerCount: ${profileUser.followers_count},
        isLoading: false,
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

        toggleFollowProfile() {
            if (!this.isLoggedIn) { window.location.href = '/login'; return; }
            this.isFollowingProfile = !this.isFollowingProfile;
            this.followerCount += this.isFollowingProfile ? 1 : -1;
            
            axios.post('/users/' + this.profile.id + '/follow')
                .then(res => {
                    this.isFollowingProfile = res.data.following;
                    this.followerCount = res.data.followers_count;
                })
                .catch(() => {
                    this.isFollowingProfile = !this.isFollowingProfile;
                    this.followerCount += this.isFollowingProfile ? 1 : -1;
                });
        },

        postTweet(body) {
            if (!body.trim() || this.isLoading) return;
            this.isLoading = true;
            axios.post('/tweets', { body })
                .then(() => {
                    this.showComposeModal = false;
                    this.modalTweetContent = '';
                    window.location.reload();
                })
                .finally(() => { this.isLoading = false; });
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
                </nav>

                <div x-show="isLoggedIn" class="mt-auto p-3 hover:bg-zinc-900 rounded-full transition flex items-center xl:space-x-3 w-fit xl:w-full cursor-pointer relative">
                    <img :src="currentUser.avatar" class="w-10 h-10 rounded-full" alt="">
                    <div class="hidden xl:block flex-1 min-w-0">
                        <p class="font-bold text-sm truncate" x-text="currentUser.name"></p>
                        <p class="text-zinc-500 text-sm truncate" x-text="currentUser.handle"></p>
                    </div>
                </div>
            </aside>

            <!-- Main Content -->
            <main class="flex-1 min-w-0 border-x border-zinc-800 xl:max-w-[600px]">
                
                <!-- Profile Header -->
                <div class="sticky top-0 bg-black/80 backdrop-blur-xl border-b border-zinc-800 z-50 flex items-center space-x-6 px-4 py-2">
                    <button onclick="history.back()" class="p-2 hover:bg-zinc-900 rounded-full transition">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                    </button>
                    <div>
                        <h1 class="text-xl font-bold" x-text="profile.name"></h1>
                        <p class="text-xs text-zinc-500" x-text="tweets.length + ' posts'"></p>
                    </div>
                </div>

                <!-- Banner & Info -->
                <div class="relative group">
                    <div class="h-48 bg-zinc-800 w-full transition-colors group-hover:bg-zinc-700/80"></div>
                    
                    <div class="px-4 pb-4">
                        <div class="relative flex justify-between items-start -mt-[15%]">
                            <img :src="profile.avatar" class="w-32 h-32 rounded-full border-4 border-black object-cover bg-black" alt="">
                            
                            <div class="mt-[18%]">
                                <template x-if="isLoggedIn && profile.id === currentUser.id">
                                    <button class="border border-zinc-600 px-4 py-2 rounded-full font-bold hover:bg-zinc-900 transition">Edit profile</button>
                                </template>
                                <template x-if="isLoggedIn && profile.id !== currentUser.id">
                                    <button 
                                        @click="toggleFollowProfile()"
                                        :class="isFollowingProfile ? 'border border-zinc-600 text-zinc-100 hover:border-red-500 hover:text-red-400 hover:bg-red-500/5' : 'bg-zinc-100 text-black hover:bg-white'"
                                        class="px-6 py-2 rounded-full font-bold transition-all duration-200 min-w-[100px]"
                                        x-text="isFollowingProfile ? 'Following' : 'Follow'"
                                    ></button>
                                </template>
                            </div>
                        </div>

                        <div class="mt-4">
                            <h2 class="text-xl font-extrabold" x-text="profile.name"></h2>
                            <p class="text-zinc-500" x-text="profile.handle"></p>
                        </div>

                        <div class="mt-3 text-zinc-100 leading-normal" x-text="profile.bio"></div>

                        <div class="mt-3 flex flex-wrap gap-y-1 gap-x-4 text-sm text-zinc-500">
                            <div class="flex items-center">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                <span x-text="profile.location"></span>
                            </div>
                            <div class="flex items-center">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                <span x-text="'Joined ' + profile.created_at"></span>
                            </div>
                        </div>

                        <div class="mt-3 flex space-x-4 text-sm">
                            <div class="hover:underline cursor-pointer">
                                <span class="font-bold text-zinc-100" x-text="profile.following_count"></span>
                                <span class="text-zinc-500 ml-0.5">Following</span>
                            </div>
                            <div class="hover:underline cursor-pointer">
                                <span class="font-bold text-zinc-100" x-text="followerCount"></span>
                                <span class="text-zinc-500 ml-0.5">Followers</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tabs -->
                <div class="flex border-b border-zinc-800">
                    <div class="flex-1 py-4 text-center font-bold relative cursor-pointer hover:bg-zinc-900 transition">
                        <span>Posts</span>
                        <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-[#1d9bf0] rounded-full"></div>
                    </div>
                    <div class="flex-1 py-4 text-center font-medium text-zinc-500 cursor-pointer hover:bg-zinc-900 transition">Replies</div>
                    <div class="flex-1 py-4 text-center font-medium text-zinc-500 cursor-pointer hover:bg-zinc-900 transition flex items-center justify-center space-x-2">
                        <span>Highlights</span>
                        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.99 7.02c-.44-2.23-2.01-4.08-4.14-4.81l-1.39-1.4a.978.978 0 00-1.4 0l-1.39 1.4c-2.13.73-3.7 2.58-4.14 4.81H4c-1.11 0-2 .89-2 2v1h5.36l.41-1.31c.21-.67.75-1.21 1.42-1.42l1.31-.41V2h3v5.27l1.31.41c.67.21 1.21.75 1.42 1.42l.41 1.31H22v-1c0-1.11-.89-2-2-2h-3.47zM4 12c-1.11 0-2 .89-2 2v6c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2v-6c0-1.11-.89-2-2-2H4z"/></svg>
                    </div>
                    <div class="flex-1 py-4 text-center font-medium text-zinc-500 cursor-pointer hover:bg-zinc-900 transition">Likes</div>
                </div>

                <!-- User Tweets Feed -->
                <div class="divide-y divide-zinc-800">
                    <template x-for="tweet in tweets" :key="tweet.id">
                        <div class="p-4 hover:bg-white/[0.03] transition flex space-x-3 cursor-pointer" @click="window.location.href = '/tweets/' + tweet.id">
                            <img :src="tweet.avatar" class="w-10 h-10 rounded-full shrink-0 object-cover" alt="">
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center space-x-1">
                                    <span class="font-bold hover:underline" x-text="tweet.user"></span>
                                    <span class="text-zinc-500 text-sm truncate" x-text="tweet.handle"></span>
                                    <span class="text-zinc-500 text-sm">·</span>
                                    <span class="text-zinc-500 text-sm" x-text="tweet.time"></span>
                                </div>
                                <p class="mt-1 text-zinc-100 whitespace-pre-wrap break-words" x-text="tweet.content"></p>
                                
                                <div class="flex items-center justify-between mt-3 text-zinc-500 max-w-md">
                                    <div class="flex items-center space-x-2 hover:text-blue-400 group">
                                        <div class="p-2 group-hover:bg-blue-500/10 rounded-full transition">${Icons.reply}</div>
                                        <span class="text-xs" x-text="tweet.replies"></span>
                                    </div>
                                    <div class="flex items-center space-x-2 hover:text-green-400 group" :class="tweet.retweeted_by_user ? 'text-green-400' : ''">
                                        <div class="p-2 group-hover:bg-green-500/10 rounded-full transition">${Icons.retweet}</div>
                                        <span class="text-xs" x-text="tweet.retweets"></span>
                                    </div>
                                    <div class="flex items-center space-x-2 hover:text-pink-400 group" :class="tweet.liked_by_user ? 'text-pink-400' : ''">
                                        <div class="p-2 group-hover:bg-pink-500/10 rounded-full transition">
                                            <svg class="w-4 h-4" :fill="tweet.liked_by_user ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"/></svg>
                                        </div>
                                        <span class="text-xs" x-text="tweet.likes"></span>
                                    </div>
                                    <div class="flex items-center space-x-2 hover:text-blue-400 group">
                                        <div class="p-2 group-hover:bg-blue-500/10 rounded-full transition">${Icons.share}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </main>

            <!-- Right Sidebar -->
            <aside class="hidden lg:block w-[350px] p-4 space-y-4 shrink-0">
                <!-- Who to follow -->
                <template x-if="isLoggedIn">
                    <div class="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                        <h2 class="text-xl font-bold p-4 pb-2">Who to follow</h2>
                        <div class="divide-y divide-zinc-800/60" x-show="whoToFollow.length > 0">
                            <template x-for="u in whoToFollow" :key="u.id">
                                <div class="flex items-center space-x-3 px-4 py-3 hover:bg-white/[0.03] transition group">
                                    <a :href="'/u/' + u.id" class="shrink-0">
                                        <img :src="u.avatar" class="w-10 h-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-[#1d9bf0]/20 transition" alt="">
                                    </a>
                                    <div class="flex-1 min-w-0">
                                        <a :href="'/u/' + u.id" class="font-bold text-sm hover:underline truncate block" x-text="u.name"></a>
                                        <span class="text-zinc-500 text-xs truncate block" x-text="u.handle"></span>
                                    </div>
                                    <button
                                        @click="toggleFollow(u.id)"
                                        :class="followingMap[u.id] ? 'border border-zinc-600 text-zinc-100' : 'bg-zinc-100 text-black hover:bg-white'"
                                        class="px-4 py-1.5 rounded-full font-bold text-sm transition shrink-0"
                                        x-text="followingMap[u.id] ? 'Following' : 'Follow'"
                                    ></button>
                                </div>
                            </template>
                        </div>
                    </div>
                </template>

                <!-- Trends -->
                <div class="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                    <h2 class="text-xl font-bold p-4 pb-2">Trends for you</h2>
                    <div class="divide-y divide-zinc-800">
                        <template x-for="(trend, index) in trends" :key="index">
                            <a :href="'/search?q=' + encodeURIComponent(trend.tag)" class="px-4 py-3 hover:bg-zinc-800 transition block no-underline text-inherit">
                                <p class="text-zinc-500 text-xs">Trending in Technology</p>
                                <p class="font-bold text-[15px]" x-text="trend.tag"></p>
                                <p class="text-zinc-500 text-xs" x-text="trend.label"></p>
                            </a>
                        </template>
                    </div>
                </div>
            </aside>
        </div>

        ${ReplyModal()}

        <!-- Compose Modal -->
        <div x-show="showComposeModal" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4" style="display:none">
            <div @click.away="showComposeModal = false" class="bg-black w-full max-w-[600px] rounded-2xl shadow-2xl border border-zinc-800 flex flex-col">
                <div class="p-4 flex items-center border-b border-zinc-800">
                    <button @click="showComposeModal = false" class="p-2 hover:bg-zinc-900 rounded-full transition text-zinc-100">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>
                <div class="p-4 flex space-x-3">
                    <img :src="currentUser.avatar" class="w-10 h-10 rounded-full shrink-0" alt="">
                    <div class="flex-1">
                        <textarea x-model="modalTweetContent" class="bg-transparent border-none focus:ring-0 w-full text-xl resize-none placeholder-zinc-500 min-h-[120px]" placeholder="What's happening?"></textarea>
                        <div class="mt-4 pt-3 border-t border-zinc-800 flex justify-end">
                            <button @click="postTweet(modalTweetContent)" :disabled="!modalTweetContent.trim() || isLoading" class="bg-[#1d9bf0] disabled:opacity-50 text-white px-5 py-2 rounded-full font-bold hover:bg-[#1a8cd8] transition">Post</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}
