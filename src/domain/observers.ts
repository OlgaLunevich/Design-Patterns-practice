/* eslint-disable max-classes-per-file */
import { Observer, TaskEvent } from './contracts';

export class Developer implements Observer {
  constructor(private name: string) {}

  update(event: TaskEvent): void {
    console.log(
      `[DEV ${this.name}] ${event.timestamp.toISOString()} | ${event.type} | ${event.taskTitle} -> ${event.message}`,
    );
  }
}

export class TeamLead implements Observer {
  constructor(private name: string) {}

  update(event: TaskEvent): void {
    if (event.type !== 'STATUS_CHANGED') return;

    console.log(
      `[TL ${this.name}] Контроль: ${event.taskTitle} | ${event.message}`,
    );
  }
}
