# The Flock Project

This is a Laravel application using Inertia.js and deployed with Docker.

## Prerequisites

- Docker and Docker Compose installed on your machine.

## Getting Started

Follow these steps to get the project up and running in your local environment.

### 1. Build and Start the Docker Containers

Run the following command to build the images and start the containers in the background:

```bash
docker compose up -d --build
```

### 2. Install Backend Dependencies

Execute `composer install` inside the application container:

```bash
docker-compose exec app composer install
```

### 3. Environment Setup

Copy the example environment file and generate a unique application key:

```bash
# Copy .env
copy .env.example .env

# Generate APP_KEY inside the container
docker-compose exec app php artisan key:generate
```

### 4. Install Frontend Dependencies

Install the NPM packages for the frontend:

```bash
docker-compose exec app npm install
```

### 5. Build Frontend Assets

Compile the frontend assets:

```bash
docker-compose exec app npm run build
```

### 6. Run Migrations

Run the database migrations to set up your tables:

```bash
docker-compose exec app php artisan migrate
```

### 7. Seed the Database

Populate the database with fake data by running the seeder. This seeder is located at `database/seeders/FakeDataSeeder.php` and it creates a test user for you to log in:

```bash
docker-compose exec app php artisan db:seed --class=FakeDataSeeder
```

## Test User Credentials

After running the `FakeDataSeeder`, you can log in to the application using the following test credentials:

- **Email:** `testuser@theflock.com`
- **Password:** `testinguser`

## Running Tests

### Backend Tests

Backend tests for the controllers and other PHP logic are located in the `/tests` directory. To run them, execute:

```bash
docker-compose exec app php artisan test
```

### Frontend Tests

Frontend tests for the Vue/React/Svelte/Alpine components are located in the `/resources/js` directory and have the `.test.js` extension. To run them, execute:

```bash
docker-compose exec app npm run test
```

## Additional Information

If you encounter timeout issues during `composer install`, you can run it with an increased timeout like so:

```bash
docker-compose exec app bash -c "COMPOSER_PROCESS_TIMEOUT=600 composer install --no-interaction --prefer-dist"
```