import { ICommand } from '../../../application/commands';
import { ICommandHandler } from '../../../application/handlers/interfaces';

import { ICommandBus } from '../../../application/bus';

export class CommandBus implements ICommandBus {
  private mappedHandlers: Map<string, ICommandHandler>;

  constructor(private readonly commandHandlers: ICommandHandler[]) {
    // eslint-disable-next-line no-restricted-syntax
    for (const handler of this.commandHandlers) {
      this.mappedHandlers.set(handler.operation, handler);
    }
  }

  public async execute(command: ICommand): Promise<void> {
    const handler = this.mappedHandlers.get(command.operation);

    if (!handler) {
      throw new Error('Handler do not exist for command');
    }

    await handler.handle(command);
  }
}
