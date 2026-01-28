import { Command } from './command';

export class CommandInvoker {
  private history: Command[] = [];

  run(command: Command): void {
    command.execute();
    if (command.undo) this.history.push(command);
  }

  undoLast(): void {
    const last = this.history.pop();
    if (last?.undo) last.undo();
  }

  getHistorySize(): number {
    return this.history.length;
  }
}
