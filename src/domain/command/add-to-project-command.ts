import { Command } from './command';
import { Project } from '../project';
import { ObservableTaskComponent } from '../contracts';

export class AddToProjectCommand implements Command {
  constructor(
    private project: Project,
    private child: ObservableTaskComponent,
  ) {}

  execute(): void {
    this.project.add(this.child);
  }

  undo(): void {
    this.project.remove(this.child.getId());
  }
}
