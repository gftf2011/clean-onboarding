import { IQueue } from '../../../application/contracts/queue';
import { ICommandBus } from '../../../application/contracts/bus';

import { CommandBus } from '../../../infra/bus/commands';
import { PostgresAdapter } from '../../../infra/database/postgres/postgres-adapter';

import {
  changeUserPasswordCommandHandlerFactory,
  createUserCommandHandlerFactory,
} from '../handlers';

export const commandBusFactory = (
  postgres: PostgresAdapter,
  queue: IQueue,
): ICommandBus => {
  const handlers = [
    createUserCommandHandlerFactory(postgres, queue),
    changeUserPasswordCommandHandlerFactory(postgres),
  ];
  const bus = new CommandBus(handlers);
  return bus;
};
