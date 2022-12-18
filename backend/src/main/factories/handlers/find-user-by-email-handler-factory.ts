import { Handler } from '../../../application/contracts/handlers';
import { FindUserByEmailHandler } from '../../../application/handlers';

import { UserRepository } from '../../../infra/repositories';
import { UserDao } from '../../../infra/dao';
import { PostgresAdapter } from '../../../infra/database/postgres/postgres-adapter';
import {
  DatabaseQueryCircuitBreakerProxy,
  DatabaseStatementCircuitBreakerProxy,
} from '../../../infra/database/postgres/circuit-breaker';

export const findUserByEmailHandlerFactory = (
  postgres: PostgresAdapter,
): Handler => {
  const userDao = new UserDao({
    read: new DatabaseQueryCircuitBreakerProxy(postgres),
    write: new DatabaseStatementCircuitBreakerProxy(postgres),
  });
  const userRepo = new UserRepository({
    user: userDao,
  });
  const handler = new FindUserByEmailHandler(userRepo);
  return handler;
};
