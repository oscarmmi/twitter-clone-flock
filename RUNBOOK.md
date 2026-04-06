# The Flock Project - Runbook

This runbook provides the necessary instructions to set up, build, and run The Flock Project locally using Docker. The application is built with Laravel, Inertia.js, and Alpine.js.

## Prerequisites & Dependencies

To ensure a stable and consistent environment, the following exact runtime versions and tools are required:

- **Docker:** v25 or newer
- **Docker Compose:** Compatible with your Docker version
- **PHP:** 8.2 (from the Docker container / development environment uses 8.3.6)
- **Node.js:** 20.x
- **PostgreSQL:** 15
- **Laravel:** 12.x
- **Alpine.js:** 3.4.x
- **Inertia.js:** 2.0

## Environment Setup

Follow these steps to set up the environment and start the application.

### 1. Build and Start the Docker Containers

The project relies on Docker for deployment. Standard execution commands (like `artisan`, `composer`, and `npm`) should be executed within the `app` container.

Run the following command to build the images and start the containers in the background:

```bash
docker compose up -d --build
```

### 2. Configure the Environment Variables

Create the `.env` file from the example provided and generate the application key. This can be done inside the container once it's up:

```bash
docker-compose exec app cp .env.example .env
docker-compose exec app php artisan key:generate
```

### 3. Install Backend Dependencies

Execute `composer install` inside the application container:

```bash
docker-compose exec app composer install
```

**Known Issue:** The environment has unreliable network connectivity and frequently encounters 400-second timeouts or 'curl error 28' when running `composer install`.
**Workaround:** Use the following command instead if you encounter this issue:
```bash
docker-compose exec app bash -c "COMPOSER_PROCESS_TIMEOUT=600 composer install --no-interaction --prefer-dist"
```

### 4. Install Frontend Dependencies

Install the NPM packages for the frontend:

```bash
docker-compose exec app npm install
```

### 5. Build Frontend Assets

Before running tests or viewing the application, frontend assets must be compiled so Inertia page renders do not fail.

```bash
docker-compose exec app npm run build
```
*(Note: Frontend Javascript components and pages in `resources/js/` return HTML template strings with Alpine.js directives rather than using a framework like Vue or React.)*

### 6. Run Migrations and Seed the Database

Run the database migrations and populate the database with fake data by running the seeder (`database/seeders/FakeDataSeeder.php`):

```bash
docker-compose exec app php artisan migrate
docker-compose exec app php artisan db:seed --class=FakeDataSeeder
```

## Test User Credentials

After running the `FakeDataSeeder`, a standard test user is generated. You can log in to the application using the following test credentials:

- **Email:** `testuser@theflock.com`
- **Password:** `testinguser`

## Running Tests

### Backend Tests

Backend tests are written for controllers and other PHP logic. The standard command to run tests requires a fully populated `vendor` directory to function.

```bash
docker-compose exec app php artisan test
```

**Known Issue:** There is a pre-existing backend test failure in `ProfileTest.php` looking for a missing `profile.edit` blade view.

### Frontend Tests

Frontend tests are written using Vitest, happy-dom (to avoid ESM top-level await issues), and @testing-library/dom.

To run them, execute:

```bash
docker-compose exec app npm run test
```

## Additional Notes

- All standard execution commands (e.g., `artisan`, `composer`, `npm`) **must** be executed within the `app` container via `docker-compose exec app <command>`.

## Technical Decisions & Q&A

**1. Why did you choose the stack that you chose?**
I chose this stack because these are technologies I am comfortable with, and I believe they align perfectly with the requirements of the role. Laravel provides a robust backend framework, while Inertia.js combined with Alpine.js allows for a seamless, modern frontend experience without the overhead of a full SPA framework.

**2. How did you model the timeline and the follows graph?**
The follows graph is modeled using a many-to-many relationship on the `User` model, joined by a pivot table named `follower_user`. This allows users to follow multiple people and have multiple followers.
For the timeline, the home feed is constructed by fetching tweets authored by the users that the authenticated user is currently following, along with the user's own tweets. The results are then ordered chronologically.

**3. How did you handle authentication?**
Authentication is handled using Laravel Breeze with standard session-based authentication (cookie/session). This approach is highly secure and perfectly suited for web applications using Inertia.js, removing the complexity and overhead of managing JWT tokens while still providing a smooth user experience.

**4. Known trade-offs and limitations.**
*   **Performance on Timeline:** As the number of followed users and tweets grows, compiling the timeline by querying the entire social graph can become slow. A future optimization would involve pre-computing feeds or implementing caching (like Redis) for timeline generation.
*   **Authentication Mechanism:** By sticking to session-based auth, it is optimized for web clients. If a mobile app or external API were to be built later, we might need to implement token-based auth (like Laravel Sanctum or Passport) alongside the existing session auth.
*   **Frontend Interactivity:** Using Alpine.js embedded in Blade/Inertia HTML templates keeps the application simple and bundle sizes small. However, for highly complex, state-heavy UI components, a full virtual DOM framework (like Vue or React) might scale better in terms of maintainability.

**5. What AI tools did you use and how did you leverage them?**
I utilized Antigravity, leveraging basically all available models, including the Gemini CLI and Jules. Each tool assisted me in a different aspect of the development lifecycle, from initial scaffolding and logic generation to debugging and refining architectural decisions.
