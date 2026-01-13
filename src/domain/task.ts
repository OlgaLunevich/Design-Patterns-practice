import {
  ObservableTaskComponent,
  TaskEvent,
  TaskStatus,
  Observer,
} from './contracts';
import { TaskSubject } from './task-subject';

export class Task implements ObservableTaskComponent {
  private subject = new TaskSubject();

  constructor(
    private id: string,
    private title: string,
    private status: TaskStatus = TaskStatus.Todo,
    private assignee: string | null = null,
  ) {}

  attach(observer: Observer): void {
    this.subject.attach(observer);
  }

  detach(observer: Observer): void {
    this.subject.detach(observer);
  }

  notify(event: TaskEvent): void {
    this.subject.notify(event);
  }

  private emit(type: TaskEvent['type'], message: string): void {
    this.notify({
      type,
      taskId: this.id,
      taskTitle: this.title,
      message,
      timestamp: new Date(),
    });
  }

  getId(): string {
    return this.id;
  }

  getTitle(): string {
    return this.title;
  }

  getStatus(): TaskStatus {
    return this.status;
  }

  setTitle(newTitle: string): void {
    const old = this.title;
    this.title = newTitle;
    this.emit('TITLE_CHANGED', `Название: "${old}" -> "${newTitle}"`);
  }

  setStatus(newStatus: TaskStatus): void {
    const old = this.status;
    this.status = newStatus;
    this.emit('STATUS_CHANGED', `Статус: ${old} -> ${newStatus}`);
  }

  setAssignee(name: string | null): void {
    const old = this.assignee;
    this.assignee = name;
    this.emit(
      'ASSIGNEE_CHANGED',
      `Исполнитель: ${old ?? '—'} -> ${name ?? '—'}`,
    );
  }

  getProgress(): number {
    if (this.status === TaskStatus.Todo) return 0;
    if (this.status === TaskStatus.InProgress) return 50;
    return 100;
  }

  print(indent: number = 0): void {
    const pad = ' '.repeat(indent);
    const assigneeText = this.assignee ? `, assignee=${this.assignee}` : '';
    console.log(
      `${pad}- [${this.status}] ${this.title} (id=${this.id}${assigneeText})`,
    );
  }
}
