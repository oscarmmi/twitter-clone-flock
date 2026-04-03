FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    zip \
    unzip

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_pgsql pgsql mbstring exif pcntl bcmath gd

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy existing application directory contents
COPY . /var/www

# We install dependencies if they are not already installed
# Since we might use volume mapping in docker-compose for dev, 
# you can also run install commands inside the container via 'docker-compose exec'
RUN composer install --no-interaction --prefer-dist --optimize-autoloader || true
RUN npm install || true
RUN npm run build || true

# Set permissions for Laravel
RUN mkdir -p /var/www/storage /var/www/bootstrap/cache \
    && chown -R www-data:www-data /var/www \
    && chmod -R 777 /var/www/storage \
    && chmod -R 777 /var/www/bootstrap/cache

EXPOSE 9000
CMD ["php-fpm"]
