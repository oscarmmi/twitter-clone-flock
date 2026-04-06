import { Icons } from '../components/icons.js';

export default function ProfileEdit(props) {
    const user = props.auth.user;
    const status = props.status;

    const userData = JSON.stringify({
        name: user.name,
        email: user.email,
        handle: '@' + user.name.toLowerCase().replace(/\s+/g, ''),
        avatar: user.avatar || `https://i.pravatar.cc/150?u=${user.id}`,
    }).replace(/"/g, '&quot;');

    return `
    <div x-data="{
        user: ${userData},
        status: '${status || ''}',
        isLoading: false,
        form: {
            name: '${user.name}',
            email: '${user.email}',
        },
        errors: {},
        
        submit() {
            this.isLoading = true;
            this.errors = {};
            
            axios.patch('/profile', this.form)
                .then(res => {
                    window.location.href = '/profile';
                })
                .catch(err => {
                    this.isLoading = false;
                    if (err.response && err.response.status === 422) {
                        this.errors = err.response.data.errors;
                    } else {
                        alert('An error occurred. Please try again.');
                    }
                });
        },

        deleteAccount() {
            if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                const password = prompt('Please enter your password to confirm account deletion:');
                if (password) {
                    axios.delete('/profile', { data: { password } })
                        .then(() => window.location.href = '/')
                        .catch(err => {
                            if (err.response && err.response.data.errors) {
                                alert(err.response.data.errors.password[0]);
                            } else {
                                alert('Failed to delete account. Please check your password.');
                            }
                        });
                }
            }
        }
    }" class="flex min-h-screen w-full bg-black text-zinc-100 font-sans">
        
        <div class="flex w-full max-w-[1300px] mx-auto">
            
            <!-- Sidebar -->
            <aside class="w-[72px] xl:w-[275px] flex flex-col items-center xl:items-start p-2 sm:p-4 sticky top-0 h-screen overflow-y-auto shrink-0 transition-all">
                <a href="${user ? '/dashboard' : '/'}" class="hover:bg-zinc-900 rounded-full p-3 transition mb-2 block w-fit">
                    ${Icons.twitter}
                </a>
                <nav class="flex-1 space-y-1 w-full text-zinc-100">
                    <a href="/dashboard" class="flex items-center space-x-5 p-3 hover:bg-zinc-900 rounded-full transition group w-fit">
                        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                        <span class="text-xl hidden xl:inline pr-4">Home</span>
                    </a>
                    <a href="/search" class="flex items-center space-x-5 p-3 hover:bg-zinc-900 rounded-full transition w-fit">
                        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>
                        <span class="text-xl hidden xl:inline pr-4">Explore</span>
                    </a>
                    <a href="/notifications" class="flex items-center space-x-5 p-3 hover:bg-zinc-900 rounded-full transition w-fit">
                        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/></svg>
                        <span class="text-xl hidden xl:inline pr-4">Notifications</span>
                    </a>
                </nav>

                <div class="mt-auto p-3 hover:bg-zinc-900 rounded-full transition flex items-center xl:space-x-3 w-fit xl:w-full cursor-pointer relative">
                    <img :src="user.avatar" class="w-10 h-10 rounded-full" alt="">
                    <div class="hidden xl:block flex-1 min-w-0">
                        <p class="font-bold text-sm truncate" x-text="user.name"></p>
                        <p class="text-zinc-500 text-sm truncate" x-text="user.handle"></p>
                    </div>
                </div>
            </aside>

            <!-- Main Timeline (Profile Edit Form) -->
            <main class="flex-1 min-w-0 border-x border-zinc-800 xl:max-w-[600px] bg-black">
                
                <!-- Header -->
                <div class="sticky top-0 bg-black/60 backdrop-blur-xl border-b border-zinc-800 z-50 flex items-center space-x-6 px-4 py-3">
                    <a href="/dashboard" class="p-2 hover:bg-zinc-900 rounded-full transition text-inherit no-underline">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                    </a>
                    <h1 class="text-xl font-bold">Profile</h1>
                </div>

                <div class="p-6 space-y-12">
                    
                    <!-- Profile Information -->
                    <section class="space-y-6">
                        <header>
                            <h2 class="text-xl font-bold text-zinc-100">Profile Information</h2>
                            <p class="mt-1 text-sm text-zinc-500">Update your account's profile information and email address.</p>
                        </header>

                        <div class="space-y-4 max-w-xl">
                            <div>
                                <label for="name" class="block text-sm font-bold text-zinc-400 mb-1">Name</label>
                                <input 
                                    id="name" 
                                    type="text" 
                                    x-model="form.name"
                                    class="w-full bg-black border border-zinc-700 rounded-md py-2 px-3 text-zinc-100 focus:border-[#1d9bf0] focus:ring-1 focus:ring-[#1d9bf0] transition"
                                    required
                                    autofocus
                                    autocomplete="name"
                                />
                                <template x-if="errors.name">
                                    <p class="mt-1 text-sm text-red-500" x-text="errors.name[0]"></p>
                                </template>
                            </div>

                            <div>
                                <label for="email" class="block text-sm font-bold text-zinc-400 mb-1">Email</label>
                                <input 
                                    id="email" 
                                    type="email" 
                                    x-model="form.email"
                                    class="w-full bg-black border border-zinc-700 rounded-md py-2 px-3 text-zinc-100 focus:border-[#1d9bf0] focus:ring-1 focus:ring-[#1d9bf0] transition"
                                    required
                                    autocomplete="username"
                                />
                                <template x-if="errors.email">
                                    <p class="mt-1 text-sm text-red-500" x-text="errors.email[0]"></p>
                                </template>
                            </div>

                            <div class="flex items-center gap-4 pt-2">
                                <button 
                                    @click="submit()"
                                    :disabled="isLoading"
                                    class="bg-zinc-100 text-black px-6 py-2 rounded-full font-bold hover:bg-white transition flex items-center space-x-2"
                                >
                                    <span x-show="isLoading" class="animate-spin h-4 w-4 border-2 border-black/30 border-t-black rounded-full"></span>
                                    <span>Save</span>
                                </button>
                                
                                <template x-if="status === 'profile-updated'">
                                    <p class="text-sm text-zinc-500 animate-fade-out">Saved.</p>
                                </template>
                            </div>
                        </div>
                    </section>

                    <div class="border-t border-zinc-800"></div>

                    <!-- Delete Account -->
                    <section class="space-y-6">
                        <header>
                            <h2 class="text-xl font-bold text-zinc-100">Delete Account</h2>
                            <p class="mt-1 text-sm text-zinc-500">Once your account is deleted, all of its resources and data will be permanently deleted.</p>
                        </header>

                        <button 
                            @click="deleteAccount()"
                            class="bg-red-600 text-white px-6 py-2 rounded-full font-bold hover:bg-red-700 transition"
                        >
                            Delete Account
                        </button>
                    </section>
                </div>
            </main>

            <!-- Right Sidebar (Empty/Minimal) -->
            <aside class="hidden lg:block w-[350px] p-4 shrink-0">
                <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <h2 class="text-xl font-bold mb-4">Settings</h2>
                    <p class="text-zinc-500 text-sm">Manage your account preferences and personal information here.</p>
                </div>
            </aside>
        </div>
    </div>
    `;
}
