import { TaskFactory } from './task-factory';
import { TaskKind } from '../contracts';
import { TaskMetaFactory } from '../flyweight/task-meta-factory';

export class BugTaskFactory extends TaskFactory {
  constructor(metaFactory: TaskMetaFactory) {
    super(metaFactory);
  }

  protected getPrefix(): string {
    return '[BUG]';
  }

  protected getKind(): TaskKind {
    return TaskKind.Bug;
  }
}
