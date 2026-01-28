import { TaskFactory } from './task-factory';
import { TaskKind } from '../contracts';
import { TaskMetaFactory } from '../flyweight/task-meta-factory';

export class ChoreTaskFactory extends TaskFactory {
  constructor(metaFactory: TaskMetaFactory) {
    super(metaFactory);
  }

  protected getPrefix(): string {
    return '[CHORE]';
  }

  protected getKind(): TaskKind {
    return TaskKind.Chore;
  }
}
