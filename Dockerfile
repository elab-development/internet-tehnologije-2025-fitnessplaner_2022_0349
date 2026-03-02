FROM php:8.2-cli

RUN apt-get update && apt-get install -y libzip-dev zip unzip \
    && docker-php-ext-install pdo_mysql zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY . .
RUN composer install --no-dev

RUN chown -R www-data:www-data /app/storage /app/bootstrap/cache || true

COPY entrypoint.prod.sh /entrypoint.prod.sh
RUN chmod +x /entrypoint.prod.sh

ENTRYPOINT ["/entrypoint.prod.sh"]