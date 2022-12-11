import { IQueue } from '../../../application/contracts/queue';
import { ICommandBus } from '../../../application/contracts/bus';

import { CommandBus } from '../../../infra/bus/commands';
import { PostgresAdapter } from '../../../infra/database/postgres/postgres-adapter';

import { createUserCommandHandlerFactory } from '../handlers';

export const commandBusFactory = (
  postgres: PostgresAdapter,
  queue: IQueue,
): ICommandBus => {
  const handlers = [createUserCommandHandlerFactory(postgres, queue)];
  const bus = new CommandBus(handlers);
  return bus;
};
