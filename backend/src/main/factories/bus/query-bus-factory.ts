import { QueryBus } from '../../../application/contracts/bus';

import { QueryBusMediator } from '../../../infra/bus/queries';
import { PostgresAdapter } from '../../../infra/database/postgres/postgres-adapter';

import {
  checkUserPasswordHandlerFactory,
  getUserSessionHandlerFactory,
  findUserByEmailHandlerFactory,
  findUserHandlerFactory,
} from '../handlers';

export const queryBusFactory = (postgres: PostgresAdapter): QueryBus => {
  const handlers = [
    checkUserPasswordHandlerFactory(),
    getUserSessionHandlerFactory(),
    findUserByEmailHandlerFactory(postgres),
    findUserHandlerFactory(postgres),
  ];
  const bus = new QueryBusMediator(handlers);
  return bus;
};
