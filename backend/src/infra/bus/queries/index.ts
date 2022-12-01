/* eslint-disable no-restricted-syntax */
import { IQuery } from '../../../application/contracts/queries';
import { IQueryHandler } from '../../../application/contracts/handlers';
import { IQueryBus } from '../../../application/contracts/bus';

export class QueryBus implements IQueryBus {
  private mapQueries: Map<string, IQuery>;

  private mapHandlers: Map<string, IQueryHandler>;

  constructor(
    private readonly queryHandlers: IQueryHandler[],
    private readonly queries: IQuery[],
  ) {
    this.registerHandlers();
    this.registerQueries();
  }

  private registerQueries(): void {
    for (const query of this.queries) {
      this.mapQueries.set(query.operation, query);
    }
  }

  private registerHandlers(): void {
    for (const handler of this.queryHandlers) {
      this.mapHandlers.set(handler.operation, handler);
    }
  }

  public async execute(action: IQuery): Promise<void> {
    const actionFound = this.mapQueries.get(action.operation);
    const handler = this.mapHandlers.get(action.operation);

    if (!actionFound) {
      throw new Error('Query not registered');
    }
    if (!handler) {
      throw new Error('Handler do not exist for query');
    }

    await handler.handle(actionFound);
  }
}
