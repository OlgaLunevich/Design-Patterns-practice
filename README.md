# Design Patterns - Factory Method, Flyweight и Command (вариант 6)

Система управления задачами команды разработки

Проект выполнен в соответствии с требованиями дисциплины Design Patterns.

Цель работы — реализовать систему управления задачами на TypeScript с использованием паттернов:

- Factory Method — создание разных типов задач;

- Flyweight — повторное использование общих данных задач (метаданных типа);

- Command — выполнение операций над задачами через команды.

Дополнительно (база проекта):

- Composite — иерархия проектов/задач/подзадач;

- Observer — уведомления разработчиков об изменениях задач.

Приложение реализует:

- иерархическую модель проектов, задач и подзадач (Composite);

- автоматические уведомления разработчиков о событиях в задачах (Observer);

- расчёт прогресса проекта по подзадачам;

- вывод структуры проекта в виде дерева;

- строгую типизацию TypeScript (strict);

- модульную архитектуру.

---

## Структура проекта (Clean Architecture)

Проект организован по принципам разделения ответственности:

```text

src/
  domain/
    contracts.ts              # Типы, интерфейсы, контракты (TaskStatus, события, Observer/Subject, TaskKind, Flyweight)
    task-subject.ts           # Реализация Subject
    task.ts                   # Task (Leaf) + события (Observer) + ссылка на flyweight-метаданные
    project.ts                # Project (Composite) + ретрансляция событий

    observers.ts              # Developer, TeamLead (Observers)

    factory/
      task-factory.ts         # Базовая фабрика (Factory Method)
      bug-task-factory.ts     # Конкретная фабрика задач Bug
      feature-task-factory.ts # Конкретная фабрика задач Feature
      chore-task-factory.ts   # Конкретная фабрика задач Chore

    flyweight/
      task-meta-factory.ts    # Flyweight Factory (кэш метаданных по TaskKind)

    command/
      command.ts              # Интерфейс Command
      invoker.ts              # Invoker (история + undoLast)
      create-task-command.ts  # Создание задачи через Factory
      add-to-project-command.ts
      change-status-command.ts
      assign-user-command.ts
      rename-task-command.ts

  index.ts                    # Точка входа (демо-сценарий)

```

---

## Используемые паттерны

### **Factory Method**

Паттерн Factory Method используется для создания задач разных типов без прямого вызова new Task(...) в клиентском коде.

- `TaskFactory` — абстрактная фабрика с общим методом `createTask(...)`.

- Конкретные фабрики:

    - `BugTaskFactory`

    - `FeatureTaskFactory`

    - `ChoreTaskFactory`

Идея:

- общий алгоритм создания зафиксирован в `createTask(...)`,

- тип задачи задаётся через переопределяемые методы фабрики.

### **Flyweight**

Паттерн Flyweight используется для повторного использования общих данных задач (intrinsic state).

В задаче выделены:

- Extrinsic state (уникальные данные): `id`, `title`, `status`, `assignee` — хранятся в `Task`.

- Intrinsic state (общие данные типа): `kind`, `defaultPriority`, `defaultTags` — хранятся в flyweight.

`TaskMetaFactory` хранит кэш `Map<TaskKind>`, `TaskMetaFlyweight>` и возвращает один и тот же объект метаданных для задач одного типа.

Таким образом, большое количество задач одного типа не дублируют одинаковые метаданные.

### **Command**

Паттерн Command применяется для выполнения операций над задачами через объекты-команды.

- `Command` — интерфейс команд (`execute()` + опционально `undo()`).

- `CommandInvoker` — запускает команды и хранит историю для `undoLast()`.

Примеры команд:

- `CreateTaskCommand` — создание задачи через фабрику;

- `AddToProjectCommand`— добавить задачу в проект (Composite-операция);

- `ChangeStatusCommand` — сменить статус;

- `AssignUserCommand` — назначить исполнителя;

- `RenameTaskCommand` — переименовать задачу.

Команды используют методы `Task`/`Project`, поэтому:

- *Observer* продолжает уведомлять разработчиков автоматически;

- *Composite* остаётся структурой хранения задач.

### **Пример сценария**

В `index.ts`:

- создаются фабрики задач,

- создаются задачи через CreateTaskCommand,

- операции выполняются через invoker,

- наблюдатели получают события автоматически.

### **Composite**
Паттерн **Composite** используется для построения иерархии задач:
- `Task` - **Leaf** (обычная задача);
- `Project` - **Composite** (проект или эпик);
- `TaskComponent` - общий интерфейс.

Благодаря этому проект может содержать:

- задачи,

- подпроекты (эпики),

- подзадачи любой глубины.

Все элементы обрабатываются одинаково:

- можно получить статус,

- прогресс,

- вывести дерево задач.

### **Observer**
Паттерн **Observer** используется для уведомления разработчиков о событиях.

В системе:

| Роль     | Класс                   |
| -------- | ----------------------- |
| Subject  | `Task`, `Project`       |
| Observer | `Developer`, `TeamLead` |

События:

- `TASK_ADDED` — добавление задачи или проекта;

- `STATUS_CHANGED` — изменение статуса;

- `ASSIGNEE_CHANGED` — смена исполнителя;

- `TITLE_CHANGED` — изменение названия.

Разработчики подписываются на корневой проект.

`Project` подписывается на своих детей и ретранслирует события вверх, поэтому наблюдатели получают уведомления обо всех изменениях внутри всей иерархии.

## Модель предметной области

**Task (Leaf)**

Представляет отдельную задачу:

- id

- название

- статус (`Todo`, `InProgress`, `Done`)

- исполнитель

Task:

- может изменять статус, название, исполнителя;

- при каждом изменении генерирует событие.

**Project (Composite)**

Представляет проект или эпик:

- содержит список задач и подпроектов;

- вычисляет статус и прогресс по дочерним элементам;

- ретранслирует события от детей своим наблюдателям.

**Пример иерархии**

```text
Team Platform
 └── Auth Epic
     ├── Сделать JWT
     └── Refresh token
```

**Прогресс**

Прогресс считается автоматически:

- `Task`:

    - Todo → 0%

    - InProgress → 50%

    - Done → 100%
- `Project`:
    - среднее значение прогресса всех подзадач.

**Пример сценария**

В `index.ts`:
```ts

root.attach(alice);
root.attach(bob);

root.add(epicAuth);
epicAuth.add(jwt);
epicAuth.add(refresh);

jwt.setStatus(TaskStatus.InProgress);
jwt.setStatus(TaskStatus.Done);

```

Разработчики получают уведомления:

```csharp
[DEV Alice] TASK_ADDED | Auth Epic | Добавлено: "Auth Epic"
[DEV Bob]   STATUS_CHANGED | Сделать JWT | Статус: Todo -> InProgress

```


## Запуск проекта

Установка зависимостей:
```bash
npm install
```

Запуск в режиме разработки:
```bash
npm run dev
```

Сборка:
```bash
npm run build
```

Запуск собранной версии:
```bash
npm start
```

## Выполнение требований задания
| Требование                                  | Статус |
| ------------------------------------------- | ------ |
| Использован паттерн Factory Method          | ✔      |
| Использован паттерн Flyweight               | ✔      |
| Использован паттерн Command                 | ✔      |
| Операции над задачами выполняются командами | ✔      |
| Повторное использование общих данных задач  | ✔      |
| TypeScript strict                           | ✔      |
| Модульная архитектура                       | ✔      |



---

##  Автор: Ольга Луневич

Студент группы 23-HO 

Вариант: **6. Composite + Observer — Система управления задачами**


