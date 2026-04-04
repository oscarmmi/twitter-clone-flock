import { Icons, TweetCard, ReplyModal } from '../components/icons.js';

export default function Welcome(props) {
    const user = props.auth.user;
    const tweets = props.tweets;
    
    // Safely stringify the user object and escape double quotes for the HTML attribute
    const userData = JSON.stringify({
        name: user?.name || 'Guest',
        handle: user ? '@' + user.name.toLowerCase().replace(/\s+/g, '') : '@guest',
        avatar: user?.avatar || `https://i.pravatar.cc/150?u=${user?.id || 'guest'}`,
        id: user?.id || null
    }).replace(/"/g, '&quot;');

    // Safely stringify the tweets array and escape double quotes for the HTML attribute
    const tweetsData = JSON.stringify(tweets || []).replace(/"/g, '&quot;');
    const trendsData = JSON.stringify(props.trends || []).replace(/"/g, '&quot;');

    // Expose auth state globally for the centralized TweetCard like button
    window._isLoggedIn = !!user;
    window._currentUserAvatar = user?.avatar || `https://i.pravatar.cc/150?u=${user?.id || 'me'}`;
    window._currentUserName = user?.name || null;
    window._currentUserHandle = user ? '@' + user.name.toLowerCase().replace(/\s+/g,'') : null;

    return `
    <div x-data="{
        activeTab: 'for-you',
        tweetContent: '',
        isLoading: false,
        user: ${userData},
        isLoggedIn: ${!!user},
        tweets: ${tweetsData},
        trends: ${trendsData},
        postTweet() {
            if (!this.isLoggedIn) {
                window.location.href = '/login';
                return;
            }
            if (this.tweetContent.trim()) {
                this.isLoading = true;
                
                axios.post('/tweets', {
                    body: this.tweetContent
                })
                .then(() => {
                    this.tweetContent = '';
                    this.isLoading = false;
                    window.location.reload();
                })
                .catch(error => {
                    this.isLoading = false;
                    const message = error.response?.data?.errors?.body?.[0] || 'Something went wrong';
                    alert(message);
                });
            }
        }
    }" class="flex min-h-screen w-full bg-black text-zinc-100 font-sans selection:bg-blue-500/30">
        
        <!-- Center Container -->
        <div class="flex w-full max-w-[1300px] mx-auto">

            <!-- Sidebar Navigation -->
            <aside class="w-[72px] xl:w-[275px] flex flex-col items-center xl:items-start p-2 sm:p-4 sticky top-0 h-screen overflow-y-auto shrink-0 transition-all">
                <div class="hover:bg-zinc-900 rounded-full p-3 transition mb-2">
                    <svg class="w-8 h-8 fill-zinc-100" viewBox="0 0 24 24"><path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"/></svg>
                </div>
                
                <nav class="flex-1 space-y-1 w-full text-zinc-100">
                    <a href="/" class="flex items-center space-x-5 p-3 hover:bg-zinc-900 rounded-full transition-all duration-200 group w-fit font-bold">
                        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                        <span class="text-xl hidden xl:inline pr-4">Home</span>
                    </a>
                    <a href="#" class="flex items-center space-x-5 p-3 hover:bg-zinc-900 rounded-full transition-all duration-200 group w-fit">
                        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>
                        <span class="text-xl hidden xl:inline pr-4">Explore</span>
                    </a>
                    <a href="#" class="flex items-center space-x-5 p-3 hover:bg-zinc-900 rounded-full transition-all duration-200 group w-fit">
                        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/></svg>
                        <span class="text-xl hidden xl:inline pr-4">Notifications</span>
                    </a>
                </nav>

                <template x-if="isLoggedIn">
                    <button class="bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold py-3 xl:w-full rounded-full flex items-center justify-center transition-all duration-200 mt-4 mb-4">
                        <span class="hidden xl:inline">Post</span>
                    </button>
                </template>

                <!-- Auth Buttons for Guests -->
                <template x-if="!isLoggedIn">
                    <div class="w-full space-y-3 mt-4 mb-4">
                        <a href="/login" class="flex items-center justify-center bg-transparent border border-zinc-700 hover:bg-zinc-900 text-white font-bold py-3 px-4 rounded-full transition-all duration-200 w-full text-center">
                            <span class="hidden xl:inline">Log in</span>
                            <svg class="w-6 h-6 xl:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
                        </a>
                        <a href="/register" class="flex items-center justify-center bg-white hover:bg-zinc-200 text-black font-bold py-3 px-4 rounded-full transition-all duration-200 w-full text-center">
                            <span class="hidden xl:inline">Register</span>
                            <svg class="w-6 h-6 xl:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                        </a>
                    </div>
                </template>

                <!-- Current User Pop -->
                <div x-show="isLoggedIn" class="mt-auto p-3 hover:bg-zinc-900 rounded-full transition flex items-center xl:space-x-3 w-fit xl:w-full cursor-pointer group">
                    <img :src="user.avatar" class="w-10 h-10 rounded-full" :alt="user.name">
                    <div class="hidden xl:block flex-1 min-w-0">
                        <p class="font-bold text-sm truncate" x-text="user.name"></p>
                        <p class="text-zinc-500 text-sm truncate" x-text="user.handle"></p>
                    </div>
                    <div class="hidden xl:block ml-auto text-zinc-500 group-hover:text-zinc-100">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/></svg>
                    </div>
                </div>
            </aside>

            <!-- Main Timeline -->
            <main class="flex-1 min-w-0 border-x border-zinc-800 xl:max-w-[600px]">
                <!-- Header -->
                <div class="sticky top-0 bg-black/60 backdrop-blur-xl border-b border-zinc-800 z-50">
                    <h1 class="p-4 text-xl font-bold">Home</h1>
                    <div class="flex text-zinc-500 font-bold border-b border-zinc-800">
                        <button @click="activeTab = 'for-you'" class="flex-1 hover:bg-zinc-900 py-4 transition relative group">
                            <span :class="activeTab === 'for-you' ? 'text-zinc-100' : ''">For you</span>
                            <div x-show="activeTab === 'for-you'" class="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-[#1d9bf0] rounded-full"></div>
                        </button>
                        <button @click="activeTab = 'following'" class="flex-1 hover:bg-zinc-900 py-4 transition relative group">
                            <span :class="activeTab === 'following' ? 'text-zinc-100' : ''">Following</span>
                            <div x-show="activeTab === 'following'" class="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-[#1d9bf0] rounded-full"></div>
                        </button>
                    </div>
                </div>

                <!-- Create Tweet -->
                <div class="p-4 flex space-x-3 border-b border-zinc-800">
                    <img :src="user.avatar" class="w-10 h-10 rounded-full shrink-0" alt="">
                    <div class="flex-1 pt-2">
                        <textarea 
                            x-model="tweetContent"
                            class="bg-transparent border-none focus:ring-0 w-full text-xl resize-none placeholder-zinc-500 overflow-hidden" 
                            placeholder="What's happening?"
                            rows="1"
                            @input="$el.style.height = ''; $el.style.height = $el.scrollHeight + 'px'"
                        ></textarea>
                        
                        <div class="mt-4 pt-3 border-t border-zinc-800 flex justify-between items-center">
                            <div class="flex space-x-3 text-[#1d9bf0]">
                                <div class="p-2 hover:bg-blue-500/10 rounded-full cursor-pointer transition">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12.75a1.5 1.5 0 001.5 1.5zm10.5-112.5h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/></svg>
                                </div>
                            </div>
                            <button 
                                @click="postTweet()"
                                :disabled="!tweetContent.trim() || isLoading"
                                class="bg-[#1d9bf0] disabled:opacity-50 text-white px-5 py-2 rounded-full font-bold hover:bg-[#1a8cd8] transition flex items-center space-x-2"
                            >
                                <span x-show="isLoading" class="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></span>
                                <span x-text="isLoading ? 'Posting...' : 'Post'"></span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Feed -->
                <div class="divide-y divide-zinc-800">
                    ${TweetCard()}
                </div>
            </main>

            <!-- Right Side Widgets -->
            <aside class="hidden lg:block w-[350px] p-4 space-y-4 shrink-0 transition-opacity">
                <!-- Search -->
                <div class="sticky top-0 bg-black pt-1 pb-4 z-40">
                    <div class="flex items-center space-x-4 bg-zinc-900 p-3 rounded-full border border-transparent focus-within:border-[#1d9bf0] focus-within:bg-black transition group">
                        <svg class="w-5 h-5 text-zinc-500 group-focus-within:text-[#1d9bf0]" fill="currentColor" viewBox="0 0 24 24"><path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/></svg>
                        <input type="text" placeholder="Search" class="bg-transparent border-none focus:ring-0 w-full placeholder-zinc-500">
                    </div>
                </div>

                <!-- Trends -->
                <div class="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                    <h2 class="text-xl font-bold p-4">Trends for you</h2>
                    <div class="divide-y divide-zinc-800">
                        <template x-for="(trend, index) in trends" :key="index">
                            <div class="px-4 py-3 hover:bg-zinc-800 transition cursor-pointer flex justify-between items-start">
                                <div>
                                    <p class="text-zinc-500 text-xs">Trending in Technology</p>
                                    <p class="font-bold" x-text="trend.tag"></p>
                                    <p class="text-zinc-500 text-xs" x-text="trend.label"></p>
                                </div>
                                <span class="text-zinc-600 text-xs mt-1" x-text="'#' + (index + 1)"></span>
                            </div>
                        </template>
                        <div x-show="trends.length === 0" class="px-4 py-6 text-center text-zinc-500 text-sm">No trends yet</div>
                    </div>
                    <a href="#" class="block p-4 text-[#1d9bf0] hover:bg-zinc-800 transition text-sm">Show more</a>
                </div>
            </aside>
        </div>
    </div>
    ${ReplyModal()}
    `;
}
