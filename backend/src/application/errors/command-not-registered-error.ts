import { ICommand } from '../contracts/commands';
import { ApplicationError } from './application-error';

export class CommandNotRegisteredError extends ApplicationError {
  constructor(command: ICommand) {
    super();
    this.message = `command action "${command.operation}" not registered`;
    this.name = CommandNotRegisteredError.name;
  }
}
