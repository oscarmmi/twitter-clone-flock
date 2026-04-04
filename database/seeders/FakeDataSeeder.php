<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Tweet;

class FakeDataSeeder extends Seeder
{
    public function run(): void
    {
        $tweetTemplates = [
            "Just shipped a new feature 🚀 The grind never stops.",
            "Hot take: dark mode should be the default everywhere.",
            "Why does CSS box-model still confuse me after 10 years? 😅",
            "Spent 3 hours debugging only to find a missing semicolon. Classic.",
            "Coffee ☕ + code = productivity. That's the formula.",
            "Clean code is not a luxury. It's a professional responsibility.",
            "If you're not failing, you're not trying hard enough.",
            "Laravel is genuinely one of the best frameworks ever built.",
            "Open source changed my life. Contribute if you can.",
            "Today I automated something that took me 2 hours manually. Took 4 hours to automate it. Worth it.",
            "No meetings today. Productivity went through the roof 📈",
            "Reading: 'The Pragmatic Programmer'. 10/10 recommend.",
            "Reminder: REST beats stress every single time.",
            "My code works and I have no idea why.",
            "Pair programming is underrated. Try it.",
            "Deploying on a Friday is a personality trait.",
            "The documentation always lies. Trust the source code.",
            "Three monitors is the minimum. I said what I said.",
            "Just discovered tabs vs spaces is still a thing in 2025. 😂",
            "Tech Twitter is a rabbit hole. A very productive rabbit hole.",
            "You can't pour from an empty cup. Rest, then code.",
            "API design is an art form. Respect it.",
            "Refactoring old code is like archaeology but worse.",
            "I love PostgreSQL more than most people I know.",
            "Building in public is terrifying and rewarding simultaneously.",
            "The best code is the code you don't have to write.",
            "Just hit 1k followers! Thank you all 🙌",
            "Sometimes the right answer is to delete the code.",
            "vim users will never not mention they use vim.",
            "Learning something new every single day. That's the goal.",
            "SQL joins finally make sense to me. I've ascended.",
            "Design systems save teams. Build one early.",
            "Redis is magic until it isn't. Then it's really not magic.",
            "My favorite color is #1d9bf0 👀",
            "Not everything needs to be a microservice.",
            "The best debugging tool is still console.log. Fight me.",
            "Today's mood: 🎧 + ☕ + 💻",
            "Imposter syndrome is real but so is your progress.",
            "Soft skills > hard skills in the long run.",
            "There is no 'one right way' in software. Context matters.",
            "Wrote 500 lines of code today. Deleted 600. Net positive.",
            "Kubernetes is just YAML all the way down.",
            "TypeScript is worth the setup cost. Trust me.",
            "Every senior dev was once a junior who didn't give up.",
            "The real MVP is whoever writes the README.",
            "Local development environments are a form of chaos.",
            "Standing meetings should be sitting meetings. Change my mind.",
            "Shipping > perfection. Ship, then iterate.",
            "Why is DNS always the problem? Why is it always DNS?",
            "Side project #47 is going to be the one. I can feel it.",
        ];

        $firstNames = ['Oscar', 'Sofia', 'Mateo', 'Valentina', 'Santiago', 'Isabella', 'Sebastián', 'Camila',
                       'Nicolás', 'Lucía', 'Daniel', 'Mariana', 'Andrés', 'Gabriela', 'Felipe', 'Andrea',
                       'Carlos', 'Natalia', 'Miguel', 'Laura', 'Diego', 'Paula', 'Alejandro', 'Daniela',
                       'David', 'Juliana', 'Juan', 'Melissa', 'Jorge', 'Carolina', 'Manuel', 'Stephanie',
                       'Ricardo', 'Paola', 'Luis', 'Angela', 'Roberto', 'Diana', 'Eduardo', 'Monica',
                       'Fernando', 'Sandra', 'Antonio', 'Jennifer', 'Marco', 'Patricia', 'Pablo', 'Cristina',
                       'Rodrigo', 'Verónica'];

        $lastNames = ['García', 'Rodríguez', 'Martínez', 'López', 'González', 'Hernández', 'Pérez', 'Sánchez',
                      'Ramírez', 'Torres', 'Flores', 'Rivera', 'Morales', 'Ortega', 'Jiménez', 'Álvarez',
                      'Reyes', 'Cruz', 'Castillo', 'Medina', 'Vargas', 'Romero', 'Herrera', 'Guerrero',
                      'Mendoza', 'Ruiz', 'Moreno', 'Aguilar', 'Castro', 'Delgado', 'Gómez', 'Núñez',
                      'Rojas', 'Suárez', 'Silva', 'Pereira', 'Ferreira', 'Alves', 'Ramos', 'Barbosa',
                      'Oliveira', 'Lima', 'Souza', 'Santos', 'Costa', 'Carvalho', 'Pinto', 'Correia',
                      'Mendes', 'Araújo'];

        $this->command->info('🌱 Starting FakeDataSeeder...');
        $this->command->info('Creating 50 users with 50 tweets each (2,500 tweets total)...');
        $bar = $this->command->getOutput()->createProgressBar(50);
        $bar->start();

        for ($i = 0; $i < 50; $i++) {
            $firstName = $firstNames[$i];
            $lastName  = $lastNames[$i];
            $name      = $firstName . ' ' . $lastName;
            $email     = strtolower($firstName) . '.' . strtolower(str_replace('ó','o', str_replace('é','e', str_replace('á','a', str_replace('í','i', str_replace('ú','u', $lastName)))))) . $i . '@flock.test';

            $user = User::create([
                'name'     => $name,
                'email'    => $email,
                'password' => Hash::make('password'),
            ]);

            // Shuffle tweets so each user has a different order
            $tweets = $tweetTemplates;
            shuffle($tweets);

            foreach (array_slice($tweets, 0, 50) as $j => $body) {
                Tweet::create([
                    'user_id'    => $user->id,
                    'body'       => $body,
                    'created_at' => now()->subMinutes(rand(1, 43200)), // random time in last 30 days
                    'updated_at' => now(),
                ]);
            }

            $bar->advance();
        }

        $bar->finish();
        $this->command->newLine();
        $this->command->info('✅ Done! Created ' . User::count() . ' users and ' . Tweet::whereNull('parent_id')->whereNull('retweet_id')->count() . ' tweets.');
    }
}
