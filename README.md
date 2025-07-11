# Silant - сервисная книга
Это fullstack-приложение, состоящее из backend, написанного на Django REST Framework (DRF), и frontend, разработанного с использованием React.js. Приложение позволяет пользователям отслеживать техническое состояние машин, а также вести учет их технического обслуживания и рекламационных случаев.

## 🚀 Функциональные возможности
### Основной функционал
- Отображение информации о машинах в табличном виде
- Просмотр подробной информации о каждой единице техники
- Учет технического обслуживания
- Управление рекламационными случаями
- Работа со справочниками

## 🛠️ Технический стек
Проект создан с использованием следующих технологий:
- **Backend**:
  - Python, Django, Django REST Framework.
  - `django-cors-headers` для настройки CORS.
  - `drf-spectacular` для документирования API.
  - `djangorestframework-simplejwt` для работы с JSON Web Token.
  
- **Frontend**:
  - React.js, Webpack.
  - Axios для выполнения запросов к API.
  - ContextApi для хранения состояний.
  - React Router для маршрутизации.

## 🔧 Установка и запуск
### 📋 Предварительные требования
Перед началом работы у вас должны быть установлены:
- Python 3.10+.
- Node.js.
- npm или yarn для управления зависимостями.


### 🛠 Установка backend (Django):
1. Перейдите в папку silant_backend:

2. Установите виртуальное окружение и зависимости:
```bash
python -m venv venv
source venv/bin/activate  # Для Windows используйте venv\Scripts\activate
pip install -r requirements.txt
```
3. Выполните миграции базы данных:
```bash
python manage.py migrate
```
4. Запустите сервер разработки:
```bash
python manage.py runserver
```
Backend будет доступен по адресу: http://127.0.0.1:8000.

По адресу http://127.0.0.1:8000/api/docs/ можно будет просмотреть документацию по API.
По адресу http://127.0.0.1:8000/api/schema/ вы скачаете JSON-схему в формате OpenAPI 3.x

### 🛠 Установка frontend (React):
1. Перейдите в папку silant_frontend

2. Установите зависимости:
```bash
npm install
```
3. Запустите сервер разработки:
```bash
npm run start
```
Frontend будет доступен по адресу: http://localhost:3000/.

## ⚙️ Структура проекта
```
📁 silant_backend              # Код для API на Django REST Framework
    📁 account                 # Приложение с логикой API для пользователя.
    📁 service_book            # Приложение с логикой API для сервисной книги.
    📁 silant                  # Основной каталог проекта 
    
📁 silant_frontend             # Исходный код клиентской части React
    📁 public                  # Основная index.html страница.
    📁 src                     # Компоненты и бизнес-логика
        📁 assets              # Статические ресурсы     
        📁 components          # React компоненты
        📁 context             # Хранилище состояния
        📁 http                # API интеграции
        📁 services            # Сервисные функции        
        📁 styles              # Стандартные стили
```

## 💻 Управление пользователями
- Регистрация пользователей осуществляется только через админ-панель
- Менеджер может создавать Клиента или Сервисную компанию.
- Пользователи не могут самостоятельно менять логин и пароль

### Тестовые номера машин
Для проверки неавторизованного доступа доступны машины со следующими номерами: 0017, 0045, 0039, 0032, 0027, 0019, 0021, 0016, 0003, 0008


### Особенности доступа
- Клиент имеет доступ только к своим машинам
- Клиент введя вручную в адресной строке адрес не их машины, например http://localhost:3000/machine/0008 смогут увидеть её ограниченные данные.
- Сервисная организация видит только закрепленные за ней машины
- Менеджер имеет полный доступ ко всем данным и справочникам
- Неавторизованные пользователи могут искать информацию по заводскому номеру

### Уровни доступа

| Роль | Машины | ТО | Рекламации |
|------|---------|-----|------------|
| Без авторизации | Просмотр ограниченной информации | Нет доступа | Нет доступа |
| Клиент | Просмотр | Просмотр и внесение изменений | Просмотр |
| Сервисная организация | Просмотр | Просмотр и внесение изменений | Просмотр и внесение изменений |
| Менеджер | Просмотр и внесение изменений | Просмотр и внесение изменений | Просмотр и внесение изменений |

### Тестовые аккаунты
| Логин | Пароль |	Роль |
|------|---------|-----|
| admin |	admin |	менеджер |
| usermanager |	silant11 |	менеджер |
| userclient1 |	silant11 |	клиент |
| userclient2 |	silant11 |	клиент |
| userclient3 |	silant11 |	клиент |
| userclient4 |	silant11 |	клиент |
| userclient5 |	silant11 |	клиент |
| userclient6 |	silant11 |	клиент |
| userclient7 |	silant11 |	клиент |
| userservcom1 |	silant11 |	сервисная организация |
| userservcom2 |	silant11 |	сервисная организация |
| userservcom3 |	silant11 |	сервисная организация |

## 🌟 Интерфейс
- Резиновая верстка
- Адаптивный дизайн
- Поддерживаемые разрешения:
  - 1920x1080
  - 1366x768
  - 1536x864
  - 1440x900
  - 360x640
- Кроссбраузерная совместимость
- Соответствие фирменному стилю "Силант"
