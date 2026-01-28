export enum TaskStatus {
  Todo = 'Todo',
  InProgress = 'InProgress',
  Done = 'Done',
}

export type TaskEventType =
  | 'TASK_ADDED'
  | 'TASK_REMOVED'
  | 'STATUS_CHANGED'
  | 'ASSIGNEE_CHANGED'
  | 'TITLE_CHANGED';

export interface TaskEvent {
  type: TaskEventType;
  taskId: string;
  taskTitle: string;
  message: string;
  timestamp: Date;
}

export interface Observer {
  update(event: TaskEvent): void;
}

export interface Subject {
  attach(observer: Observer): void;
  detach(observer: Observer): void;
  notify(event: TaskEvent): void;
}

export interface TaskComponent {
  getId(): string;
  getTitle(): string;
  getStatus(): TaskStatus;
  getProgress(): number;
  print(indent?: number): void;
}

export type ObservableTaskComponent = TaskComponent & Subject;

export enum TaskKind {
  Bug = 'Bug',
  Feature = 'Feature',
  Chore = 'Chore',
  Generic = 'Generic',
}

export interface TaskMetaFlyweight {
  kind: TaskKind;
  defaultPriority: number;
  defaultTags: string[];
}
