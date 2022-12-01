import { ICommand } from '../contracts/commands';

export class CommandNotRegisteredError extends Error {
  constructor(command: ICommand) {
    super();
    this.message = `command action "${command.operation}" not registered`;
    this.name = CommandNotRegisteredError.name;
  }
}
