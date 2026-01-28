import { Command } from './command';
import { Task } from '../task';
import { TaskFactory } from '../factory/task-factory';

export class CreateTaskCommand implements Command {
  private created: Task | null = null;

  constructor(
    private factory: TaskFactory,
    private id: string,
    private title: string,
  ) {}

  execute(): void {
    this.created = this.factory.createTask(this.id, this.title);
  }

  getTask(): Task {
    if (!this.created) {
      throw new Error('Task has not been created yet. Call execute() first.');
    }
    return this.created;
  }
}
