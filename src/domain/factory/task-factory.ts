import { Task } from '../task';
import { TaskStatus, TaskKind } from '../contracts';
import { TaskMetaFactory } from '../flyweight/task-meta-factory';

export abstract class TaskFactory {
  constructor(private metaFactory: TaskMetaFactory) {}

  createTask(id: string, title: string): Task {
    const decoratedTitle = `${this.getPrefix()} ${title}`;
    const meta = this.metaFactory.get(this.getKind());

    return new Task(id, decoratedTitle, TaskStatus.Todo, null, meta);
  }

  protected abstract getPrefix(): string;

  protected abstract getKind(): TaskKind;
}
