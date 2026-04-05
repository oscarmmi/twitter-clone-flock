import { Icons, ReplyModal } from '../components/icons.js';

export default function Notifications(props) {
    const user = props.auth.user;
    const notifications = props.notifications || [];

    const userData = JSON.stringify({
        name: user?.name,
        handle: user ? '@' + user.name.toLowerCase().replace(/\s+/g, '') : '',
        avatar: user?.avatar || `https://i.pravatar.cc/150?u=${user?.id}`,
        id: user?.id
    }).replace(/"/g, '&quot;');

    const notificationsData = JSON.stringify(notifications).replace(/"/g, '&quot;');

    return `
    <div x-data="{
        user: ${userData},
        notifications: ${notificationsData},
        unread_count: ${props.auth.unread_notifications_count || 0},
        init() {
            // Polling for unread notifications every 15 seconds
            setInterval(() => {
                axios.get('/notifications/unread-count')
                    .then(res => { this.unread_count = res.data.count; })
                    .catch(() => {});
            }, 15000);
        },
        logout() {
            axios.post('/logout').then(() => window.location.href = '/');
        }
    }" class="flex min-h-screen w-full bg-black text-zinc-100 font-sans">

        <div class="flex w-full max-w-[1300px] mx-auto">

            <!-- Sidebar -->
            <aside class="w-[72px] xl:w-[275px] flex flex-col items-center xl:items-start p-2 sm:p-4 sticky top-0 h-screen overflow-y-auto shrink-0">
                <div class="hover:bg-zinc-900 rounded-full p-3 transition mb-2">
                    ${Icons.twitter}
                </div>
                <nav class="flex-1 space-y-1 w-full text-zinc-100">
                    <a href="/dashboard" class="flex items-center space-x-5 p-3 hover:bg-zinc-900 rounded-full transition w-fit">
                        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                        <span class="text-xl hidden xl:inline pr-4">Home</span>
                    </a>
                    <a href="/search" class="flex items-center space-x-5 p-3 hover:bg-zinc-900 rounded-full transition w-fit">
                        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>
                        <span class="text-xl hidden xl:inline pr-4">Explore</span>
                    </a>
                    <a href="/notifications" class="flex items-center space-x-5 p-3 bg-zinc-900/60 rounded-full transition w-fit font-bold text-[#1d9bf0] relative">
                        <div class="relative">
                            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/></svg>
                            <template x-if="unread_count > 0">
                                <span class="absolute -top-1 -right-1 bg-[#1d9bf0] text-zinc-100 text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-black" x-text="unread_count"></span>
                            </template>
                        </div>
                        <span class="text-xl hidden xl:inline pr-4 text-zinc-100">Notifications</span>
                    </a>
                </nav>
                <div class="mt-auto p-3 hover:bg-zinc-900 rounded-full transition flex items-center xl:space-x-3 w-fit xl:w-full cursor-pointer relative group" x-data="{ open: false }" @click="open = !open">
                    <img :src="user.avatar" class="w-10 h-10 rounded-full" alt="">
                    <div class="hidden xl:block flex-1 min-w-0">
                        <p class="font-bold text-sm truncate" x-text="user.name"></p>
                        <p class="text-zinc-500 text-sm truncate" x-text="user.handle"></p>
                    </div>
                </div>
            </aside>

            <!-- Main Content -->
            <main class="flex-1 min-w-0 border-x border-zinc-800 xl:max-w-[600px]">
                <div class="sticky top-0 bg-black/80 backdrop-blur-xl border-b border-zinc-800 z-50 p-4">
                    <h1 class="text-xl font-bold">Notifications</h1>
                </div>

                <div class="divide-y divide-zinc-800">
                    <template x-for="notif in notifications" :key="notif.id">
                        <div class="p-4 hover:bg-white/[0.03] transition flex space-x-3 border-b border-zinc-800/50">
                            <!-- Icon Column -->
                            <div class="pt-1 shrink-0">
                                <template x-if="notif.type.includes('TweetLiked')">
                                    <svg class="w-8 h-8 text-pink-500 fill-current" viewBox="0 0 24 24"><path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"/></svg>
                                </template>
                                <template x-if="notif.type.includes('TweetReplied')">
                                    <svg class="w-8 h-8 text-[#1d9bf0] fill-current" viewBox="0 0 24 24"><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.243c4.421 0 8.005 3.58 8.005 8 0 4.418-3.584 8-8.005 8H6.749L2.497 21.5c-.225.176-.531.205-.784.075-.253-.131-.412-.395-.412-.681V10z"/></svg>
                                </template>
                            </div>

                            <!-- Content Column -->
                            <div class="flex-1">
                                <div class="flex items-center space-x-2 mb-2">
                                    <img :src="notif.data.user_avatar" class="w-8 h-8 rounded-full border border-zinc-800" alt="">
                                </div>
                                <div class="text-sm">
                                    <span class="font-bold" x-text="notif.data.user_name"></span> 
                                    <span class="text-zinc-500" x-text="notif.type.includes('TweetLiked') ? ' liked your post' : ' replied to your post'"></span>
                                    <span class="text-zinc-500 text-xs ml-2" x-text="notif.time"></span>
                                </div>
                                <p class="text-zinc-500 text-sm mt-1 line-clamp-2" x-text="notif.data.body"></p>
                            </div>
                        </div>
                    </template>

                    <div x-show="notifications.length === 0" class="p-12 text-center text-zinc-500">
                        <p class="text-xl font-bold text-zinc-100 mb-2">No notifications yet</p>
                        <p class="text-sm">When someone likes your posts or follows you, you'll see it here.</p>
                    </div>
                </div>
            </main>

            <!-- Right Sidebar -->
            <aside class="hidden lg:block w-[350px] p-4 space-y-4 shrink-0">
                <div class="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden p-4">
                    <h2 class="text-xl font-bold mb-4">You're in control</h2>
                    <p class="text-zinc-500 text-sm">Follow people you like and keep the conversation going.</p>
                </div>
            </aside>
        </div>
    </div>
    `;
}
