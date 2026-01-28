import { TaskKind, TaskMetaFlyweight } from '../contracts';

export class TaskMetaFactory {
  private cache = new Map<TaskKind, TaskMetaFlyweight>();

  get(kind: TaskKind): TaskMetaFlyweight {
    const cached = this.cache.get(kind);
    if (cached) return cached;

    const created = this.createMeta(kind);
    this.cache.set(kind, created);
    return created;
  }

  private createMeta(kind: TaskKind): TaskMetaFlyweight {
    switch (kind) {
      case TaskKind.Bug:
        return { kind, defaultPriority: 1, defaultTags: ['bug'] };
      case TaskKind.Feature:
        return { kind, defaultPriority: 2, defaultTags: ['feature'] };
      case TaskKind.Chore:
        return { kind, defaultPriority: 3, defaultTags: ['chore'] };
      case TaskKind.Generic:
      default:
        return { kind: TaskKind.Generic, defaultPriority: 3, defaultTags: [] };
    }
  }
}
