<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
        <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">

        <!-- Scripts -->
        @vite(['resources/js/app.js', 'resources/css/app.css'])
        @inertiaHead
    </head>
    <body class="font-sans antialiased text-[#1b1b18] dark:text-[#ededec] bg-[#fdfdfc] dark:bg-[#0a0a0a]">
        @inertia
    </body>
</html>
