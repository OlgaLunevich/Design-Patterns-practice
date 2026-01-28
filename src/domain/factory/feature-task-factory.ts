import { TaskFactory } from './task-factory';
import { TaskKind } from '../contracts';
import { TaskMetaFactory } from '../flyweight/task-meta-factory';

export class FeatureTaskFactory extends TaskFactory {
  constructor(metaFactory: TaskMetaFactory) {
    super(metaFactory);
  }

  protected getPrefix(): string {
    return '[FEATURE]';
  }

  protected getKind(): TaskKind {
    return TaskKind.Feature;
  }
}

