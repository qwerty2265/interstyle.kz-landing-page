InterStyle Landing Page

Структура проекта:
- index.html — основной HTML-файл сайта
- styles.css — стили сайта
- actions.js — логика для интерактивных элементов и отправки формы
- sendmail.php — обработчик формы, отправка заявок на почту и логирование
- public/ — изображения и медиафайлы
- logs/ — логи отправленных форм
- vendor/ — зависимости PHP (PHPMailer и др.), устанавливаются через Composer

Запуск проекта:

1. Установка зависимостей PHP
   В корне проекта выполните:
   php composer.phar install
   или, если Composer установлен глобально:
   composer install

2. Настройка переменных окружения
   Создайте файл .env в корне проекта и добавьте строки:
   GMAIL_APP_PASSWORD="ваш_пароль_приложения"
   GMAIL_APP_USERNAME="ваш_аккаунт_приложения"
   GMAIL_TO_EMAIL="ваша_почта_для_получения_писем"

   Подробнее про пароль и аккаунт приложения можно узнать тут:
   https://support.google.com/accounts/answer/185833?hl=ru

3. Запуск локального сервера
   Выполните команду:
   php -S localhost:8000
   Откройте http://localhost:8000/index.html в браузере.

Отправка формы:
Форма отправляется через AJAX на sendmail.php, который отправляет письмо на указанный email и пишет лог в logs/form_submissions.log.