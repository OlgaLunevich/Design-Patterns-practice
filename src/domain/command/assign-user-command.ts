import { Command } from './command';
import { Task } from '../task';

export class AssignUserCommand implements Command {
  private prevAssignee: string | null = null;

  constructor(
    private task: Task,
    private nextAssignee: string | null,
  ) {}

  execute(): void {
    this.prevAssignee = this.task.getAssignee();
    this.task.setAssignee(this.nextAssignee);
  }

  undo(): void {
    this.task.setAssignee(this.prevAssignee);
  }
}
