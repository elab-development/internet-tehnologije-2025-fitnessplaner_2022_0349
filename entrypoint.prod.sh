#!/bin/sh

sed -i "s/80/${PORT}/g" /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf

php artisan migrate --force

exec apache2-foreground