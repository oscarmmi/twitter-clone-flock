<x-guest-layout>
    <div class="mb-8">
        <h1 class="text-3xl font-extrabold text-zinc-100 whitespace-nowrap">Sign in to Flock</h1>
    </div>

    <!-- Session Status -->
    <x-auth-session-status class="mb-4" :status="session('status')" />

    <form method="POST" action="{{ route('login') }}" class="space-y-6">
        @csrf

        <!-- Email Address -->
        <div class="space-y-1">
            <label for="email" class="text-sm font-medium text-zinc-500 ml-1">Email</label>
            <input id="email" 
                class="block w-full bg-black border border-zinc-800 text-zinc-100 rounded-xl py-4 px-4 focus:border-[#1d9bf0] focus:ring-1 focus:ring-[#1d9bf0] transition-all outline-none placeholder-zinc-700" 
                type="email" 
                name="email" 
                value="{{ old('email') }}" 
                required 
                autofocus 
                autocomplete="username" 
                placeholder="Enter your email"
            />
            <x-input-error :messages="$errors->get('email')" class="mt-1 ml-1" />
        </div>

        <!-- Password -->
        <div class="space-y-1">
            <div class="flex justify-between items-center px-1">
                <label for="password" class="text-sm font-medium text-zinc-500">Password</label>
                @if (Route::has('password.request'))
                    <a class="text-xs text-[#1d9bf0] hover:underline" href="{{ route('password.request') }}">
                        Forgot password?
                    </a>
                @endif
            </div>
            <input id="password" 
                class="block w-full bg-black border border-zinc-800 text-zinc-100 rounded-xl py-4 px-4 focus:border-[#1d9bf0] focus:ring-1 focus:ring-[#1d9bf0] transition-all outline-none placeholder-zinc-700"
                type="password"
                name="password"
                required 
                autocomplete="current-password" 
                placeholder="Enter your password"
            />
            <x-input-error :messages="$errors->get('password')" class="mt-1 ml-1" />
        </div>

        <!-- Remember Me -->
        <div class="flex items-center px-1">
            <label for="remember_me" class="inline-flex items-center cursor-pointer group">
                <input id="remember_me" type="checkbox" class="rounded border-zinc-800 bg-black text-[#1d9bf0] focus:ring-[#1d9bf0] focus:ring-offset-black" name="remember">
                <span class="ms-3 text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">Remember me</span>
            </label>
        </div>

        <div class="pt-4">
            <button type="submit" class="w-full bg-white text-black hover:bg-zinc-200 font-bold py-3.5 rounded-full transition-all duration-200 transform active:scale-[0.98]">
                Log in
            </button>
        </div>

        <div class="text-center pt-8">
            <p class="text-zinc-500 text-sm">
                Don't have an account? 
                <a href="{{ route('register') }}" class="text-[#1d9bf0] hover:underline font-medium">Sign up</a>
            </p>
        </div>
    </form>
</x-guest-layout>
