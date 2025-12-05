# Design Patterns — Овал и Конус (Задание 3.8 + Расширение: Repository, Specification, Comparator, Warehouse, Observer, Singleton)

Проект выполнен в соответствии с требованиями дисциплины **Design Patterns**.  
Вариант: **3.8 — Овал и Конус**.

Цель работы — разработать приложение на TypeScript

Приложение реализует:

- объектную модель фигур Овал и Конус;

- чтение данных из файла и валидацию;

- вычисление площадей, объёмов, периметров;

- фабрики (Factory Method);

- поиск фигур по паттерну Specification;

- сортировки по паттерну Comparator;

- хранение фигур в Repository;

- хранение вычисленных значений в Warehouse (Singleton);

- автоматические обновления метрик через Observer;

- полное покрытие Jest-тестами;

- логирование (pino);

- архитектурное разделение на слои.

---

## Структура проекта (Clean Architecture)

Проект организован по принципам «чистой архитектуры»:

```text
src/
  domain/                # Чистый домен: сущности, интерфейсы, контракты
    entities/
      point.ts
      oval.ts
      cone.ts
    shapes/
      shape.ts
    repositories/
      shape-repository.ts
    specifications/
      specification.ts
      shape-id-specification.ts
      shape-type-specification.ts
      first-quadrant-specification.ts
      distance-range-specification.ts
      measure-range-specification.ts
    comparators/
      comparator.ts
      shape-id-comparator.ts
      shape-type-comparator.ts
      oval-first-point-x-comparator.ts
      cone-base-center-y-comparator.ts
    observer/
      shape-observer.ts
      shape-change-type.ts
    errors/
      app-error.ts
      validation-error.ts
      file-error.ts

  application/           # Сервисы, фабрики, бизнес-логика
    factories/
      shape-factory.ts
      oval-factory.ts
      cone-factory.ts
    services/
      oval-geometry-service.ts
      cone-geometry-service.ts
      shape-search-service.ts
    warehouse/
      shape-warehouse.ts     # Singleton + Observer

  infrastructure/         # Работа с файлами, логирование, репозитории
    file/
      shape-file-reader.ts
    logger/
      logger.ts
    repositories/
      in-memory-shape-repository.ts   # Реализация Repository + Observable

  shared/
    validation/
      validator.ts
      validation-result.ts
      oval-input-validator.ts
      cone-input-validator.ts
      geometry-result-validator.ts
    constants/
      math.ts
      regex.ts

index.ts                  # Точка входа
```


---

## Используемые паттерны

### **Factory Method**
Для создания фигур из входных строк применяется паттерн **Factory Method**:

- `OvalFactory`
- `ConeFactory`

Каждая фабрика:
- принимает строку из файла,
- валидирует параметры,
- создаёт объект-сущность или возвращает `null`.

### **Чистые сущности (Entities)**
Сущности **не содержат бизнес-логики**, только данные и геттеры:
- `Point`
- `Oval`
- `Cone`

Геометрия реализована в сервисах (`application/services`).

### **Repository (расширенная реализация)**

Реализация — InMemoryShapeRepository, который поддерживает:

- `add`, `addMany`

- `update`

- `removeById`

- `getById`, `getAll`, `clear`

- `findBySpecification`

- `sort(Comparator)`

### **Specification (поиск фигур по условиям)**


| Спецификация               | Файл                        | Что делает                                     |
| -------------------------- | --------------------------- | ---------------------------------------------- |
| ShapeIdSpecification       | shape-id-specification.ts   | поиск по ID                                    |
| ShapeTypeSpecification     | shape-type-specification.ts | поиск по типу (oval/cone)                      |
| FirstQuadrantSpecification | first-quadrant…             | центр в I квадранте                            |
| DistanceRangeSpecification | distance-range…             | расстояние от начала координат                 |
| MeasureRangeSpecification  | measure-range…              | площадь/периметр/объём/поверхность в диапазоне |

Используются в `ShapeSearchService` для:

- поиска овалов по диапазону площади/периметра,

- поиска конусов по объёму/площади поверхности,

- поиска фигур в первом квадранте,

- поиска по типу и ID,

- поиска по расстоянию.

### **Comparator (сортировка фигур)**
Реализованы компараторы:

`ShapeIdComparator`

`ShapeTypeComparator`

`OvalFirstPointXComparator`

`OvalFirstPointYComparator`

`ConeBaseCenterXComparator`

`ConeBaseCenterYComparator`

Проект поддерживает сортировки:

- по ID,

- по типу,

- по координатам первой точки овала,

- по координатам центра конуса.

Сортировка выполняется через:

`repo.sort(new ShapeIdComparator());`

### **Warehouse (Singleton + Observer)**

Warehouse хранит геометрические параметры фигур:

Для Овала:

- площадь

- периметр

Для Конуса:

- объём

- площадь поверхности

Warehouse:

- является Singleton → один на всё приложение,

- реализует Observer и подписан на репозиторий,

- автоматически пересчитывает метрики при:

- добавлении фигуры,

- обновлении фигуры,

- удалении фигуры.

## Формат входных файлов

Данные читаются из `data/*.txt`.

### Для Овала:

x1 y1 x2 y2

Две точки — противоположные углы описанного прямоугольника.

### Формат Конуса:
x y z radius height


Некорректные строки:

- пропускаются,
- логируются,
- не останавливают выполнение программы.

---

## Валидация

### **1. Валидация входных данных**

Используются валидаторы:

- `OvalInputValidator`
- `ConeInputValidator`

Проверяется:

- количество значений,
- числовой формат,
- положительность радиуса и высоты,
- возможность построения фигуры.

### **2. Валидация результатов вычислений**

`GeometryResultValidator` проверяет:

- конечность (`isFinite`),
- неотрицательность результата.

Если вычисление некорректно → в лог пишется ошибка, метод возвращает `0`.

---

## Геометрические операции

### **Овал**

- площадь: `πab`
- периметр (приближение Рамануджана)
- является ли:
    - валидным овалом,
    - кругом (`|a - b| < ε`)
- пересекает ли только одну ось координат в пределах расстояния

### **Конус**

- объём: `(π r² h) / 3`
- площадь полной поверхности: `π r (r + √(r² + h²))`
- основание лежит на координатной плоскости (`z ≈ 0`)
- **рассечение плоскостью OXY (z = 0):**
    - расчёт объёмов верхней и нижней части по коэффициенту подобия `t³`

---

## Логирование (pino)

Используется библиотека **pino**, выводящая логи:

- в консоль (`stdout`)
- в файл `logs/app.log`

Логи фиксируют:

- ошибки валидации,
- пропуск некорректных строк,
- успешную загрузку фигур.

---

## Тестирование (Jest)

| Компонент          | Покрытие                                    |
| ------------------ | ------------------------------------------- |
| Фабрики            | корректные/некорректные строки              |
| Валидаторы         | входные данные, результаты вычислений       |
| Geometry services  | площадь, периметр, объём, поверхность       |
| Repository         | add, update, remove, sort, find             |
| Specifications     | ID, type, quadrant, distance, measure range |
| Comparators        | id, type, координаты                        |
| ShapeSearchService | все методы поиска                           |
| Warehouse          | пересчёт при add/update/remove              |


Команда запуска:

`npm test`

Каждый тест содержит более одного `expect`, согласно требованиям.

---

## Запуск проекта

Установка:

`npm install`


Сборка:

`npm run build`


Запуск:

`npm run dev`


---

## Требования задания — выполнены

- ✔ Использованы **ES6 модули** (`import` / `export`)
- ✔ Применён паттерн **Factory Method**
- ✔ Сущности **без бизнес-логики**
- ✔ Реализованы валидаторы входных данных
- ✔ Реализована валидация результатов вычислений
- ✔ Используются **кастомные ошибки**
- ✔ Присутствует **логирование** через `pino`
- ✔ Реализовано чтение данных из файлов с пропуском некорректных строк
- ✔ Покрытие **unit-тестами (Jest)**
- ✔ Соблюдены требования Style Guide (ESLint, TypeScript strict)
- ✔ Архитектура приведена к Clean Architecture

## Выполнение требований задания (вторая часть)

| Требование                                    | Статус |
| --------------------------------------------- | ------ |
| Все объекты сохраняются в Repository          | ✔      |
| Реализованы Specification для поиска          | ✔      |
| Методы добавления/удаления в репозитории      | ✔      |
| Сортировки через Comparator                   | ✔      |
| Площади/объёмы/периметры хранятся в Warehouse | ✔      |
| Изменение фигуры вызывает пересчёт метрик     | ✔      |
| Использованы Observer + Singleton             | ✔      |
| Написаны тесты для всех компонентов           | ✔      |


---

##  Автор: Ольга Луневич

Студент группы 23-HO 
Вариант: **3.8 — Овал и Конус**


