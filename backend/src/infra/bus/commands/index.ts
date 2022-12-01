/* eslint-disable no-restricted-syntax */
import { ICommand } from '../../../application/contracts/commands';
import { ICommandHandler } from '../../../application/contracts/handlers';
import { ICommandBus } from '../../../application/contracts/bus';
import { CommandNotRegisteredError } from '../../../application/errors';

export class CommandBus implements ICommandBus {
  private mapCommands: Map<string, ICommand>;

  private mapHandlers: Map<string, ICommandHandler>;

  constructor(
    private readonly commandHandlers: ICommandHandler[],
    private readonly commands: ICommand[],
  ) {
    this.registerCommands();
    this.registerHandlers();
  }

  private registerCommands(): void {
    for (const command of this.commands) {
      this.mapCommands.set(command.operation, command);
    }
  }

  private registerHandlers(): void {
    for (const handler of this.commandHandlers) {
      this.mapHandlers.set(handler.operation, handler);
    }
  }

  public async execute(command: ICommand): Promise<void> {
    const commandFound = this.mapCommands.get(command.operation);
    const handler = this.mapHandlers.get(command.operation);

    if (!commandFound || !handler) {
      throw new CommandNotRegisteredError(command);
    }

    await handler.handle(commandFound);
  }
}
