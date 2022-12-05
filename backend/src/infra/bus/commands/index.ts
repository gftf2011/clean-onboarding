/* eslint-disable no-restricted-syntax */
import { ICommand } from '../../../application/contracts/commands';
import { ICommandHandler } from '../../../application/contracts/handlers';
import { ICommandBus } from '../../../application/contracts/bus';
import { CommandNotRegisteredError } from '../../../application/errors';

export class CommandBus implements ICommandBus {
  private mapHandlers: Map<string, ICommandHandler>;

  constructor(private readonly commandHandlers: ICommandHandler[]) {
    this.registerHandlers();
  }

  private registerHandlers(): void {
    this.mapHandlers = new Map<string, ICommandHandler>();
    for (const handler of this.commandHandlers) {
      this.mapHandlers.set(handler.operation, handler);
    }
  }

  public async execute(command: ICommand): Promise<void> {
    const handler = this.mapHandlers.get(command.operation);

    if (!handler) {
      throw new CommandNotRegisteredError(command);
    }

    await handler.handle(command);
  }
}
