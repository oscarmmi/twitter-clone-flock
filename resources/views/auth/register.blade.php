<x-guest-layout>
    <div class="mb-8 text-center sm:text-left">
        <h1 class="text-3xl font-extrabold text-zinc-100">Create your account</h1>
        <p class="text-zinc-500 text-sm mt-2 font-medium">Join Flock today and see what's happening.</p>
    </div>

    <form method="POST" action="{{ route('register') }}" class="space-y-5">
        @csrf

        <!-- Name -->
        <div class="space-y-1">
            <label for="name" class="text-sm font-medium text-zinc-500 ml-1">Name</label>
            <input id="name" 
                class="block w-full bg-black border border-zinc-800 text-zinc-100 rounded-xl py-4 px-4 focus:border-[#1d9bf0] focus:ring-1 focus:ring-[#1d9bf0] transition-all outline-none placeholder-zinc-700" 
                type="text" 
                name="name" 
                value="{{ old('name') }}" 
                required 
                autofocus 
                autocomplete="name" 
                placeholder="What's your name?"
            />
            <x-input-error :messages="$errors->get('name')" class="mt-1 ml-1" />
        </div>

        <!-- Email Address -->
        <div class="space-y-1">
            <label for="email" class="text-sm font-medium text-zinc-500 ml-1">Email</label>
            <input id="email" 
                class="block w-full bg-black border border-zinc-800 text-zinc-100 rounded-xl py-4 px-4 focus:border-[#1d9bf0] focus:ring-1 focus:ring-[#1d9bf0] transition-all outline-none placeholder-zinc-700" 
                type="email" 
                name="email" 
                value="{{ old('email') }}" 
                required 
                autocomplete="username" 
                placeholder="Enter your email"
            />
            <x-input-error :messages="$errors->get('email')" class="mt-1 ml-1" />
        </div>

        <!-- Password -->
        <div class="space-y-1">
            <label for="password" class="text-sm font-medium text-zinc-500 ml-1">Password</label>
            <input id="password" 
                class="block w-full bg-black border border-zinc-800 text-zinc-100 rounded-xl py-4 px-4 focus:border-[#1d9bf0] focus:ring-1 focus:ring-[#1d9bf0] transition-all outline-none placeholder-zinc-700"
                type="password"
                name="password"
                required 
                autocomplete="new-password" 
                placeholder="Choose a password"
            />
            <x-input-error :messages="$errors->get('password')" class="mt-1 ml-1" />
        </div>

        <!-- Confirm Password -->
        <div class="space-y-1">
            <label for="password_confirmation" class="text-sm font-medium text-zinc-500 ml-1">Confirm Password</label>
            <input id="password_confirmation" 
                class="block w-full bg-black border border-zinc-800 text-zinc-100 rounded-xl py-4 px-4 focus:border-[#1d9bf0] focus:ring-1 focus:ring-[#1d9bf0] transition-all outline-none placeholder-zinc-700"
                type="password"
                name="password_confirmation" 
                required 
                autocomplete="new-password" 
                placeholder="Repeat your password"
            />
            <x-input-error :messages="$errors->get('password_confirmation')" class="mt-1 ml-1" />
        </div>

        <div class="pt-6">
            <button type="submit" class="w-full bg-[#1d9bf0] text-white hover:bg-[#1a8cd8] font-bold py-3.5 rounded-full transition-all duration-200 transform active:scale-[0.98] shadow-[0_8px_20px_rgba(29,155,240,0.2)]">
                Create account
            </button>
        </div>

        <div class="text-center pt-6">
            <p class="text-zinc-500 text-sm">
                By signing up, you agree to the Terms of Service.
            </p>
            <p class="text-zinc-500 text-sm mt-4">
                Already have an account? 
                <a href="{{ route('login') }}" class="text-[#1d9bf0] hover:underline font-medium">Log in</a>
            </p>
        </div>
    </form>
</x-guest-layout>
