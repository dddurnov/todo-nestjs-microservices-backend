# Проект Todo List

## Описание

Проект включает в себя два микросервиса:

- **Auth Service**: Сервис аутентификации
- **Board Service**: Сервис управления задачами и проектами

Оба сервиса используют PostgreSQL базы данных и RabbitMQ для обмена сообщениями.

## Установка и запуск

1. **Клонируйте репозиторий**

   ```bash
   git clone https://github.com/dddurnov/todo-nestjs-microservices-backend.git
   cd todo-nestjs-microservices-backend


2. **Создайте файл `.env`**

   В корневой директории проекта создайте файл `.env` и добавьте в него следующие переменные окружения:

   ```env
   AUTH_DATABASE_HOST=auth-db
   AUTH_DATABASE_PORT=5432
   AUTH_DATABASE_USERNAME=postgres
   AUTH_DATABASE_PASSWORD=1111
   AUTH_DATABASE_NAME=auth_service

   BOARD_DATABASE_HOST=board-db
   BOARD_DATABASE_PORT=5432
   BOARD_DATABASE_USERNAME=postgres
   BOARD_DATABASE_PASSWORD=1111
   BOARD_DATABASE_NAME=board_service

   RABBITMQ_HOST=rabbitmq
   RABBITMQ_PORT=5672

   JWT_SECRET=default_secret

3. **Запустите Docker Compose**

   Убедитесь, что у вас установлен Docker и Docker Compose. Затем выполните команду:

   ```bash
   docker-compose up --build
4. **Проверьте доступность**

   - **Auth Service**: [http://localhost:3001](http://localhost:3001)
   - **Board Service**: [http://localhost:3002](http://localhost:3002)
   - **RabbitMQ Management**: [http://localhost:15672](http://localhost:15672) (Логин: guest, Пароль: guest)
   - 
 ## Остановка

   Для остановки контейнеров выполните команду:

   ```bash
   docker-compose down

