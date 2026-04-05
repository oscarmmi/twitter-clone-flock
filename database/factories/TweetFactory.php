<?php

namespace Database\Factories;

use App\Models\Tweet;
use Illuminate\Database\Eloquent\Factories\Factory;

class TweetFactory extends Factory
{
    protected $model = Tweet::class;

    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'body' => $this->faker->sentence(10),
        ];
    }
}
