// Centralized icon library — change SVGs here and they update everywhere.

export const Icons = {
    reply: `<svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
        <path stroke-linecap="round" stroke-linejoin="round" d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"/>
    </svg>`,

    retweet: `<svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"/>
    </svg>`,

    like: `<svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
        <path stroke-linecap="round" stroke-linejoin="round" d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"/>
    </svg>`,

    share: `<svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
    </svg>`,

    twitter: `<svg class="w-8 h-8 fill-zinc-100" viewBox="0 0 24 24">
        <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"/>
    </svg>`,

    search: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
    </svg>`,
};

// Reusable tweet card HTML — used in Welcome.js and Dashboard.js
export function TweetCard() {
    return `
    <template x-for="tweet in tweets" :key="tweet.id">
        <div class="p-4 hover:bg-white/[0.03] transition cursor-pointer flex space-x-3 group border-b border-zinc-800">
            <img :src="tweet.avatar || 'https://i.pravatar.cc/150?u=' + tweet.user_id" class="w-10 h-10 rounded-full shrink-0 object-cover" alt="">
            <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-1 flex-wrap">
                    <span class="font-bold hover:underline truncate max-w-[120px]" x-text="tweet.user?.name || tweet.user"></span>
                    <span class="text-zinc-500 text-sm truncate" x-text="tweet.handle || ('@' + (tweet.user?.name || '').toLowerCase().replace(/\\s+/g,''))"></span>
                    <span class="text-zinc-500 text-sm">·</span>
                    <span class="text-zinc-500 text-sm" x-text="tweet.time || tweet.created_at_human || 'now'"></span>
                </div>
                <p class="mt-1 text-zinc-100 whitespace-pre-wrap break-words" x-text="tweet.body || tweet.content"></p>
                
                <!-- Action Buttons -->
                <div class="flex justify-between mt-3 text-zinc-500 max-w-[350px]">
                    <button class="flex items-center space-x-2 hover:text-blue-400 transition group/btn">
                        <div class="p-2 group-hover/btn:bg-blue-500/10 rounded-full">${Icons.reply}</div>
                        <span x-text="tweet.replies_count ?? tweet.replies ?? 0" class="text-xs"></span>
                    </button>
                    <button class="flex items-center space-x-2 hover:text-green-400 transition group/btn">
                        <div class="p-2 group-hover/btn:bg-green-500/10 rounded-full">${Icons.retweet}</div>
                        <span x-text="tweet.retweets_count ?? tweet.retweets ?? 0" class="text-xs"></span>
                    </button>
                    <!-- Like button with optimistic UI -->
                    <div x-data="{
                        liked: tweet.liked_by_user ?? false,
                        count: tweet.likes_count ?? tweet.likes ?? 0,
                        loading: false,
                        toggle() {
                            if (this.loading) return;

                            // Redirect to login if not authenticated
                            if (!window._isLoggedIn) {
                                window.location.href = '/login';
                                return;
                            }

                            // Optimistic update
                            this.liked = !this.liked;
                            this.count += this.liked ? 1 : -1;
                            this.loading = true;

                            axios.post('/tweets/' + tweet.id + '/like')
                                .then(res => {
                                    this.liked = res.data.liked;
                                    this.count = res.data.likes_count;
                                })
                                .catch(() => {
                                    // Rollback on failure
                                    this.liked = !this.liked;
                                    this.count += this.liked ? 1 : -1;
                                })
                                .finally(() => { this.loading = false; });
                        }
                    }">
                        <button
                            @click.stop="toggle()"
                            :class="liked ? 'text-pink-500' : 'text-zinc-500 hover:text-pink-400'"
                            class="flex items-center space-x-2 transition group/btn"
                        >
                            <div :class="liked ? 'bg-pink-500/10' : 'group-hover/btn:bg-pink-500/10'" class="p-2 rounded-full transition">
                                <svg class="w-[18px] h-[18px] transition-transform" :class="{ 'scale-125': liked }" fill="none" :fill="liked ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"/>
                                </svg>
                            </div>
                            <span x-text="count" class="text-xs"></span>
                        </button>
                    </div>
                    <!-- Share button with dropdown -->
                    <div class="relative" x-data="{ shareOpen: false }">
                        <button @click.stop="shareOpen = !shareOpen" class="flex items-center space-x-2 hover:text-blue-400 transition group/btn">
                            <div class="p-2 group-hover/btn:bg-blue-500/10 rounded-full">${Icons.share}</div>
                        </button>

                        <!-- Share Dropdown -->
                        <div
                            x-show="shareOpen"
                            @click.away="shareOpen = false"
                            x-transition:enter="transition ease-out duration-150"
                            x-transition:enter-start="opacity-0 scale-95"
                            x-transition:enter-end="opacity-100 scale-100"
                            x-transition:leave="transition ease-in duration-100"
                            x-transition:leave-start="opacity-100 scale-100"
                            x-transition:leave-end="opacity-0 scale-95"
                            class="absolute bottom-full right-0 mb-2 w-56 bg-black border border-zinc-800 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)] overflow-hidden z-50"
                        >
                            <!-- Copy Link -->
                            <button
                                @click.stop="
                                    const url = window.location.origin + '/tweets/' + tweet.id;
                                    navigator.clipboard.writeText(url).then(() => {
                                        $el.querySelector('span').textContent = 'Copied!';
                                        setTimeout(() => { $el.querySelector('span').textContent = 'Copy link'; shareOpen = false; }, 1500);
                                    });
                                "
                                class="flex items-center space-x-3 w-full px-4 py-3 hover:bg-zinc-900 transition text-zinc-100 text-sm font-bold"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                                </svg>
                                <span>Copy link</span>
                            </button>

                            <!-- Native Share (mobile/supported browsers) -->
                            <button
                                x-show="!!navigator.share"
                                @click.stop="
                                    navigator.share({
                                        title: (tweet.user?.name || tweet.user) + ' on Flock',
                                        text: tweet.body || tweet.content,
                                        url: window.location.origin + '/tweets/' + tweet.id
                                    }).then(() => { shareOpen = false; }).catch(() => {});
                                "
                                class="flex items-center space-x-3 w-full px-4 py-3 hover:bg-zinc-900 transition text-zinc-100 text-sm font-bold"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                                </svg>
                                <span>Share via...</span>
                            </button>

                            <div class="border-t border-zinc-800 my-1"></div>

                            <!-- Share to WhatsApp -->
                            <a
                                :href="'https://wa.me/?text=' + encodeURIComponent((tweet.body || tweet.content) + ' ' + window.location.origin + '/tweets/' + tweet.id)"
                                target="_blank"
                                @click="shareOpen = false"
                                class="flex items-center space-x-3 w-full px-4 py-3 hover:bg-zinc-900 transition text-zinc-100 text-sm font-bold"
                            >
                                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                </svg>
                                <span>Share to WhatsApp</span>
                            </a>

                            <!-- Share to Telegram -->
                            <a
                                :href="'https://t.me/share/url?url=' + encodeURIComponent(window.location.origin + '/tweets/' + tweet.id) + '&text=' + encodeURIComponent(tweet.body || tweet.content)"
                                target="_blank"
                                @click="shareOpen = false"
                                class="flex items-center space-x-3 w-full px-4 py-3 hover:bg-zinc-900 transition text-zinc-100 text-sm font-bold"
                            >
                                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                                </svg>
                                <span>Share to Telegram</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </template>`;
}
