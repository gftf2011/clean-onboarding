import { IQueryBus } from '../../../application/contracts/bus';

import { QueryBus } from '../../../infra/bus/queries';

import {
  checkUserPasswordQueryHandlerFactory,
  createUserSessionQueryHandlerFactory,
  findUserByEmailQueryHandlerFactory,
  findUserQueryHandlerFactory,
} from '../handlers';

export const queryBusFactory = (): IQueryBus => {
  const handlers = [
    checkUserPasswordQueryHandlerFactory(),
    createUserSessionQueryHandlerFactory(),
    findUserByEmailQueryHandlerFactory(),
    findUserQueryHandlerFactory(),
  ];
  const bus = new QueryBus(handlers);
  return bus;
};
