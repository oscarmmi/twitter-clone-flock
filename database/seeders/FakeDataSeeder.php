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
        $hashtags = [
            ['#Laravel', '#PHP', '#WebDev'],
            ['#OpenSource', '#DevCommunity', '#GitHub'],
            ['#CSS', '#Frontend', '#WebDesign'],
            ['#Debugging', '#CodeLife', '#100DaysOfCode'],
            ['#Coffee', '#DevLife', '#Programming'],
            ['#CleanCode', '#BestPractices', '#SoftwareEngineering'],
            ['#Motivation', '#GrowthMindset', '#Tech'],
            ['#Laravel', '#PHP', '#BackendDev'],
            ['#OpenSource', '#GitHub', '#SoftwareDevelopment'],
            ['#Productivity', '#Automation', '#DevTips'],
            ['#WorkLifeBalance', '#RemoteWork', '#TechLife'],
            ['#BookRecommendation', '#DevBooks', '#LearningEveryday'],
            ['#MentalHealth', '#TechLife', '#Mindfulness'],
            ['#FunnyDev', '#CodeLife', '#Relatable'],
            ['#PairProgramming', '#Teamwork', '#AgileLife'],
            ['#DevOps', '#BadPractices', '#FridayFeeling'],
            ['#Documentation', '#TechTips', '#DevLife'],
            ['#Productivity', '#MultiMonitor', '#SetupGoals'],
            ['#HotTake', '#CodingWars', '#TabsVsSpaces'],
            ['#TwitterDev', '#OpenSource', '#BuildingInPublic'],
            ['#Developer', '#SelfCare', '#TechTips'],
            ['#APIDesign', '#BackendDev', '#WebDev'],
            ['#Refactoring', '#LegacyCode', '#TechLife'],
            ['#PostgreSQL', '#Databases', '#BackendDev'],
            ['#BuildInPublic', '#IndieHacker', '#StartupLife'],
            ['#CleanCode', '#Programming', '#DevTips'],
            ['#Milestone', '#GrowthMindset', '#Community'],
            ['#Architecture', '#SoftwareDesign', '#DevTips'],
            ['#VimLife', '#Editors', '#FunnyDev'],
            ['#LearningEveryday', '#Growth', '#DevLife'],
            ['#SQL', '#Databases', '#LevelUp'],
            ['#DesignSystem', '#UX', '#Frontend'],
            ['#Redis', '#Backend', '#Architecture'],
            ['#ColorPalette', '#UIDesign', '#WebDesign'],
            ['#Architecture', '#Microservices', '#BackendDev'],
            ['#Debugging', '#FunnyDev', '#DevLife'],
            ['#MoodOfTheDay', '#DevLife', '#Coding'],
            ['#ImposterSyndrome', '#YouGotThis', '#100DaysOfCode'],
            ['#SoftSkills', '#CareerGrowth', '#TechLife'],
            ['#SoftwareEngineering', '#Agile', '#DevTips'],
            ['#CodeReview', '#CleanCode', '#Metrics'],
            ['#Kubernetes', '#DevOps', '#CloudNative'],
            ['#TypeScript', '#JavaScript', '#WebDev'],
            ['#CareerAdvice', '#JuniorDev', '#Mentorship'],
            ['#OpenSource', '#README', '#Documentation'],
            ['#LocalDev', '#DevLife', '#Docker'],
            ['#Agile', '#Meetings', '#Productivity'],
            ['#ShipIt', '#MVP', '#StartupLife'],
            ['#DNS', '#DevOps', '#AlwaysDNS'],
            ['#SideProject', '#IndieHacker', '#BuildInPublic'],
        ];

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

        $this->command->info('🌱 Starting FakeDataSeeder with Social Interactions...');

        // 1. CREATE ALL USERS FIRST
        $this->command->info('Creating 50 active users...');
        $allUsers = [];
        for ($i = 0; $i < 50; $i++) {
            $firstName = $firstNames[$i];
            $lastName  = $lastNames[$i];
            $name      = $firstName . ' ' . $lastName;
            $email     = strtolower($firstName) . '.' . strtolower(str_replace(['ó','é','á','í','ú'], ['o','e','a','i','u'], $lastName)) . $i . '@flock.test';

            $allUsers[] = User::create([
                'name'     => $name,
                'email'    => $email,
                'password' => Hash::make('password'),
                'created_at' => now()->subDays(rand(30, 60)),
            ]);
        }

        // 2. CREATE TWEETS
        $this->command->info('Generating tweets for all users...');
        $allTweets = [];
        $bar = $this->command->getOutput()->createProgressBar(count($allUsers));
        $bar->start();

        foreach ($allUsers as $user) {
            $tweetsToCreate = $tweetTemplates;
            shuffle($tweetsToCreate);

            foreach (array_slice($tweetsToCreate, 0, 25) as $j => $body) {
                $tagGroup = $hashtags[$j % count($hashtags)];
                $tags = implode(' ', array_slice($tagGroup, 0, rand(1, 2)));

                $allTweets[] = Tweet::create([
                    'user_id'    => $user->id,
                    'body'       => $body . "\n\n" . $tags,
                    'created_at' => now()->subMinutes(rand(1, 43200)),
                    'updated_at' => now(),
                ]);
            }
            $bar->advance();
        }
        $bar->finish();
        $this->command->newLine();

        // 3. SOCIAL INTERACTIONS: FOLLOWS
        $this->command->info('Simulating social network (Follows)...');
        foreach ($allUsers as $user) {
            $toFollowIds = User::where('id', '!=', $user->id)
                ->inRandomOrder()
                ->limit(rand(10, 30))
                ->pluck('id');
            
            $user->following()->attach($toFollowIds);
        }

        // 4. SOCIAL INTERACTIONS: LIKES
        $this->command->info('Injecting engagement (Likes)...');
        $bar = $this->command->getOutput()->createProgressBar(count($allUsers));
        $bar->start();

        foreach ($allUsers as $user) {
            // Pick random tweets to like (not their own)
            $tweetIdsToLike = Tweet::where('user_id', '!=', $user->id)
                ->inRandomOrder()
                ->limit(rand(50, 100))
                ->pluck('id');
            
            $user->likes()->attach($tweetIdsToLike);
            $bar->advance();
        }
        $bar->finish();
        $this->command->newLine();

        $this->command->info('✅ Done! The network is now alive with ' . Tweet::count() . ' tweets and thousands of interactions.');
    }
}
