/* eslint-disable no-restricted-syntax */
import { Action } from '../../../application/contracts/actions';
import { Handler } from '../../../application/contracts/handlers';
import { QueryBus } from '../../../application/contracts/bus';
import { ActionNotRegisteredError } from '../../../application/errors';

export class QueryBusImpl implements QueryBus {
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

  public async execute(query: Action): Promise<any> {
    const handler = this.mapHandlers.get(query.operation);

    if (!handler) {
      throw new ActionNotRegisteredError(query);
    }

    return handler.handle(query);
  }
}
