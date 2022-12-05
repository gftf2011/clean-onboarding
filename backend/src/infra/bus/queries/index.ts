/* eslint-disable no-restricted-syntax */
import { IQuery } from '../../../application/contracts/queries';
import { IQueryHandler } from '../../../application/contracts/handlers';
import { IQueryBus } from '../../../application/contracts/bus';
import { QueryNotRegisteredError } from '../../../application/errors';

export class QueryBus implements IQueryBus {
  private mapHandlers: Map<string, IQueryHandler>;

  constructor(private readonly queryHandlers: IQueryHandler[]) {
    this.registerHandlers();
  }

  private registerHandlers(): void {
    this.mapHandlers = new Map<string, IQueryHandler>();
    for (const handler of this.queryHandlers) {
      this.mapHandlers.set(handler.operation, handler);
    }
  }

  public async execute(action: IQuery): Promise<any> {
    const handler = this.mapHandlers.get(action.operation);

    if (!handler) {
      throw new QueryNotRegisteredError(action);
    }

    return handler.handle(action);
  }
}
