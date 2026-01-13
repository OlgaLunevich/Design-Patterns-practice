import { Observer, Subject, TaskEvent } from './contracts';

export class TaskSubject implements Subject {
  private observers: Set<Observer> = new Set();

  attach(observer: Observer): void {
    this.observers.add(observer);
  }

  detach(observer: Observer): void {
    this.observers.delete(observer);
  }

  notify(event: TaskEvent): void {
    this.observers.forEach((o) => o.update(event));
  }
}
