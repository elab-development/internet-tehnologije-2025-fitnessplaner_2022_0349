FROM php:8.2-apache

RUN a2enmod rewrite

RUN apt-get update && apt-get install -y \
    git unzip libzip-dev \
 && docker-php-ext-install pdo pdo_mysql zip \
 && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
COPY . .

RUN chown -R www-data:www-data /var/www/html

EXPOSE 80
