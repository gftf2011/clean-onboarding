import { IQueryBus } from '../../../application/contracts/bus';

import { QueryBus } from '../../../infra/bus/queries';
import { PostgresAdapter } from '../../../infra/database/postgres/postgres-adapter';

import {
  checkUserPasswordQueryHandlerFactory,
  createUserSessionQueryHandlerFactory,
  findUserByEmailQueryHandlerFactory,
  findUserQueryHandlerFactory,
} from '../handlers';

export const queryBusFactory = (postgres: PostgresAdapter): IQueryBus => {
  const handlers = [
    checkUserPasswordQueryHandlerFactory(),
    createUserSessionQueryHandlerFactory(),
    findUserByEmailQueryHandlerFactory(postgres),
    findUserQueryHandlerFactory(postgres),
  ];
  const bus = new QueryBus(handlers);
  return bus;
};
