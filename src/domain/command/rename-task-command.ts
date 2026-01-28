import { Command } from './command';
import { Task } from '../task';

export class RenameTaskCommand implements Command {
  private prevTitle: string | null = null;

  constructor(
    private task: Task,
    private nextTitle: string,
  ) {}

  execute(): void {
    this.prevTitle = this.task.getTitle();
    this.task.setTitle(this.nextTitle);
  }

  undo(): void {
    if (!this.prevTitle) return;
    this.task.setTitle(this.prevTitle);
  }
}
