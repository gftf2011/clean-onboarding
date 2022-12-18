import { IQueue } from '../../../application/contracts/queue';
import { CommandBus } from '../../../application/contracts/bus';

import { CommandBusImpl } from '../../../infra/bus/commands';
import { PostgresAdapter } from '../../../infra/database/postgres/postgres-adapter';

import {
  changeUserPasswordHandlerFactory,
  createUserHandlerFactory,
} from '../handlers';

export const commandBusFactory = (
  postgres: PostgresAdapter,
  queue: IQueue,
): CommandBus => {
  const handlers = [
    createUserHandlerFactory(postgres, queue),
    changeUserPasswordHandlerFactory(postgres),
  ];
  const bus = new CommandBusImpl(handlers);
  return bus;
};
