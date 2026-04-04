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
                    <button class="flex items-center space-x-2 hover:text-pink-400 transition group/btn">
                        <div class="p-2 group-hover/btn:bg-pink-500/10 rounded-full">${Icons.like}</div>
                        <span x-text="tweet.likes_count ?? tweet.likes ?? 0" class="text-xs"></span>
                    </button>
                    <button class="flex items-center space-x-2 hover:text-blue-400 transition group/btn">
                        <div class="p-2 group-hover/btn:bg-blue-500/10 rounded-full">${Icons.share}</div>
                    </button>
                </div>
            </div>
        </div>
    </template>`;
}
