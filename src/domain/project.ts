import {
  ObservableTaskComponent,
  TaskEvent,
  TaskStatus,
  Observer,
} from './contracts';
import { TaskSubject } from './task-subject';

export class Project implements ObservableTaskComponent, Observer {
  private subject = new TaskSubject();

  private children: ObservableTaskComponent[] = [];

  constructor(private id: string, private title: string) {}

  attach(observer: Observer): void {
    this.subject.attach(observer);
  }

  detach(observer: Observer): void {
    this.subject.detach(observer);
  }

  notify(event: TaskEvent): void {
    this.subject.notify(event);
  }

  private emit(
    type: TaskEvent['type'],
    message: string,
    taskId?: string,
    taskTitle?: string,
  ): void {
    this.notify({
      type,
      taskId: taskId ?? this.id,
      taskTitle: taskTitle ?? this.title,
      message,
      timestamp: new Date(),
    });
  }

  update(event: TaskEvent): void {
    this.notify(event);
  }

  getId(): string {
    return this.id;
  }

  getTitle(): string {
    return this.title;
  }

  add(child: ObservableTaskComponent): void {
    this.children.push(child);

    child.attach(this);

    this.emit(
      'TASK_ADDED',
      `Добавлено: "${child.getTitle()}" в "${this.title}"`,
      child.getId(),
      child.getTitle(),
    );
  }

  remove(childId: string): void {
    const idx = this.children.findIndex((c) => c.getId() === childId);
    if (idx === -1) return;

    const removed = this.children[idx];

    removed.detach(this);
    this.children.splice(idx, 1);

    this.emit(
      'TASK_REMOVED',
      `Удалено: "${removed.getTitle()}" из "${this.title}"`,
      removed.getId(),
      removed.getTitle(),
    );
  }

  getChildren(): ObservableTaskComponent[] {
    return [...this.children];
  }

  getStatus(): TaskStatus {
    if (this.children.length === 0) return TaskStatus.Todo;

    const statuses = this.children.map((c) => c.getStatus());
    if (statuses.every((s) => s === TaskStatus.Done)) return TaskStatus.Done;
    if (statuses.some((s) => s === TaskStatus.InProgress)) return TaskStatus.InProgress;
    return TaskStatus.Todo;
  }

  getProgress(): number {
    if (this.children.length === 0) return 0;
    const sum = this.children.reduce((acc, c) => acc + c.getProgress(), 0);
    return Math.round(sum / this.children.length);
  }

  print(indent: number = 0): void {
    const pad = ' '.repeat(indent);
    console.log(
      `${pad}+ Project: ${this.title} (id=${this.id}, status=${this.getStatus()}, progress=${this.getProgress()}%)`,
    );
    this.children.forEach((c) => c.print(indent + 2));
  }
}
