FROM php:8.1-apache

# Install all PHP extensions required by Perfex CRM
RUN apt-get update && apt-get install -y \
        libcurl4-openssl-dev \
        libssl-dev \
        libonig-dev \
        libc-client-dev \
        libkrb5-dev \
        libgd-dev \
        libzip-dev \
 && docker-php-ext-configure imap --with-kerberos --with-imap-ssl \
 && docker-php-ext-install \
        mysqli \
        pdo \
        pdo_mysql \
        curl \
        mbstring \
        imap \
        gd \
        zip \
 && a2enmod rewrite \
 && rm -rf /var/lib/apt/lists/*

# Perfex requires allow_url_fopen
RUN echo "allow_url_fopen = On" >> /usr/local/etc/php/conf.d/perfex.ini

# Apache virtual host with AllowOverride All (needed for Perfex .htaccess)
COPY apache.conf /etc/apache2/sites-available/000-default.conf

# Perfex files are bind-mounted from ./html on the host (not baked into image)
# so the admin can update/configure them without rebuilding.
EXPOSE 80
