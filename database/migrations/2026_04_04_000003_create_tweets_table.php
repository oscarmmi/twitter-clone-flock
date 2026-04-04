<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tweets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->text('body')->nullable();
            $table->foreignId('parent_id')->nullable()->constrained('tweets')->cascadeOnDelete(); // For replies
            $table->foreignId('retweet_id')->nullable()->constrained('tweets')->cascadeOnDelete(); // For retweets
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tweets');
    }
};
