import { Handler } from '../../../application/contracts/handlers';
import { FindUserHandler } from '../../../application/handlers';

import { RemoteUserRepositoryFactory } from '../../../infra/repositories';
import { UserDao } from '../../../infra/dao';
import { PostgresAdapter } from '../../../infra/database/postgres/postgres-adapter';
import {
  DatabaseQueryCircuitBreakerProxy,
  DatabaseStatementCircuitBreakerProxy,
} from '../../../infra/database/postgres/circuit-breaker';

export const findUserHandlerFactory = (postgres: PostgresAdapter): Handler => {
  const userDao = new UserDao({
    read: new DatabaseQueryCircuitBreakerProxy(postgres),
    write: new DatabaseStatementCircuitBreakerProxy(postgres),
  });
  const userRepo = new RemoteUserRepositoryFactory(userDao).createRepository();
  const handler = new FindUserHandler(userRepo);
  return handler;
};
