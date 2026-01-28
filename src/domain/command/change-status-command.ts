import { Command } from './command';
import { TaskStatus } from '../contracts';
import { Task } from '../task';

export class ChangeStatusCommand implements Command {
  private prevStatus: TaskStatus | null = null;

  constructor(
    private task: Task,
    private nextStatus: TaskStatus,
  ) {}

  execute(): void {
    this.prevStatus = this.task.getStatus();
    this.task.setStatus(this.nextStatus);
  }

  undo(): void {
    if (!this.prevStatus) return;
    this.task.setStatus(this.prevStatus);
  }
}
