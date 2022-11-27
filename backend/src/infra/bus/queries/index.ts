import { IQuery } from '../../../application/queries';
import { IQueryHandler } from '../../../application/handlers/interfaces';

import { IQueryBus } from '../../../application/bus';

export class QueryBus implements IQueryBus {
  private mappedHandlers: Map<string, IQueryHandler>;

  constructor(private readonly queryHandlers: IQueryHandler[]) {
    // eslint-disable-next-line no-restricted-syntax
    for (const handler of this.queryHandlers) {
      this.mappedHandlers.set(handler.operation, handler);
    }
  }

  public async execute(action: IQuery): Promise<void> {
    const handler = this.mappedHandlers.get(action.operation);

    if (!handler) {
      throw new Error('Handler do not exist for query');
    }

    await handler.handle(action);
  }
}
