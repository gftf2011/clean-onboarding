import { IQueryBus } from '../../../application/contracts/bus';

import { QueryBus } from '../../../infra/bus/queries';
import { PostgresAdapter } from '../../../infra/database/postgres/postgres-adapter';

import {
  checkUserPasswordQueryHandlerFactory,
  getUserSessionQueryHandlerFactory,
  findUserByEmailQueryHandlerFactory,
  findUserQueryHandlerFactory,
} from '../handlers';

export const queryBusFactory = (postgres: PostgresAdapter): IQueryBus => {
  const handlers = [
    checkUserPasswordQueryHandlerFactory(),
    getUserSessionQueryHandlerFactory(),
    findUserByEmailQueryHandlerFactory(postgres),
    findUserQueryHandlerFactory(postgres),
  ];
  const bus = new QueryBus(handlers);
  return bus;
};
