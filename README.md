# Математичні вправи для дітей

Цей проект був створений у режимі vibe coding за допомогою Cursor AI. Він являє собою інтерактивну веб-програму для вивчення математики, призначену для дітей.

## Опис проекту

Проект містить набір математичних вправ для дітей, які допомагають у вивченні:
- Таблиці множення
- Таблиці ділення
- Додавання до 10
- Віднімання до 10
- Порівняння чисел до 10

## Основні функції

- **Інтерактивний інтерфейс**: Зручний та зрозумілий інтерфейс для дітей
- **Різні рівні складності**: Кожна гра має три рівні складності
- **Система прогресу**: Відстеження прогресу під час виконання вправ
- **Статистика помилок**: Зберігання та аналіз помилок для подальшого повторення
- **Модальні вікна**: Візуальний фідбек про правильність відповідей

## Технічний стек

- HTML5
- CSS3
- JavaScript (Vanilla)
- LocalStorage для зберігання статистики
- Компонентний підхід до структури проекту

## Як використовувати

1. Відкрийте `index.html` у веб-браузері
2. Оберіть тип вправ (множення, ділення, додавання, віднімання або порівняння)
3. Виберіть рівень складності (якщо доступний)
4. Починайте вирішувати приклади
5. Переглядайте статистику помилок у відповідному розділі

## Структура проекту

```
├── index.html              # Головна сторінка програми
├── styles.css              # Стилі для всіх елементів інтерфейсу
└── components/             # Директорія з компонентами гри
    ├── multiplication/     # Компонент гри на множення
    │   ├── index.html     # HTML компонента
    │   └── script.js      # Логіка гри
    ├── division/          # Компонент гри на ділення
    │   ├── index.html     # HTML компонента
    │   └── script.js      # Логіка гри
    ├── addition/          # Компонент гри на додавання
    │   ├── index.html     # HTML компонента
    │   └── script.js      # Логіка гри
    ├── subtraction/       # Компонент гри на віднімання
    │   ├── index.html     # HTML компонента
    │   └── script.js      # Логіка гри
    ├── comparison/        # Компонент гри на порівняння
    │   ├── index.html     # HTML компонента
    │   └── script.js      # Логіка гри
    └── common/            # Спільні компоненти
        ├── statistics.html # Компонент статистики
        └── script.js      # Спільна логіка для всіх ігор
```

## Особливості реалізації

- Адаптивний дизайн
- Анімації для кращого користувацького досвіду
- Система збереження прогресу
- Можливість повторення помилок
- Компонентна архітектура для кращої підтримки та розширення
- Динамічне завантаження компонентів

## Розгортання на GitHub Pages

1. Встановіть залежності:
```bash
npm install
```

2. Налаштуйте репозиторій:
```bash
git remote add origin https://github.com/yourusername/math-exercises-for-kids.git
```

3. Зробіть перший коміт:
```bash
git add .
git commit -m "Initial commit"
git push -u origin main
```

4. Розгорніть проект на GitHub Pages:
```bash
npm run deploy
```

Після успішного розгортання, ваш проект буде доступний за адресою:
`https://yourusername.github.io/math-exercises-for-kids` 