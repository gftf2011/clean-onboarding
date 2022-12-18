/* eslint-disable no-restricted-syntax */
import { Action } from '../../../application/contracts/actions';
import { Handler } from '../../../application/contracts/handlers';
import { CommandBus } from '../../../application/contracts/bus';
import { ActionNotRegisteredError } from '../../../application/errors';

export class CommandBusImpl implements CommandBus {
  private mapHandlers: Map<string, Handler>;

  constructor(private readonly handlers: Handler[]) {
    this.registerHandlers();
  }

  private registerHandlers(): void {
    this.mapHandlers = new Map<string, Handler>();
    for (const handler of this.handlers) {
      this.mapHandlers.set(handler.operation, handler);
    }
  }

  public async execute(command: Action): Promise<void> {
    const handler = this.mapHandlers.get(command.operation);

    if (!handler) {
      throw new ActionNotRegisteredError(command);
    }

    await handler.handle(command);
  }
}
