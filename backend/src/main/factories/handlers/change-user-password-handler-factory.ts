import { Handler } from '../../../application/contracts/handlers';
import { ChangeUserPasswordHandler } from '../../../application/handlers';

import { UserRepository } from '../../../infra/repositories';
import { UserDao } from '../../../infra/dao';
import { PostgresAdapter } from '../../../infra/database/postgres/postgres-adapter';
import { HashSha512Provider } from '../../../infra/providers';
import {
  DatabaseQueryCircuitBreakerProxy,
  DatabaseStatementCircuitBreakerProxy,
} from '../../../infra/database/postgres/circuit-breaker';

export const changeUserPasswordHandlerFactory = (
  postgres: PostgresAdapter,
): Handler => {
  const hashProvider = new HashSha512Provider();

  const userDao = new UserDao({
    read: new DatabaseQueryCircuitBreakerProxy(postgres),
    write: new DatabaseStatementCircuitBreakerProxy(postgres),
  });

  const userRepo = new UserRepository({
    user: userDao,
  });
  const handler = new ChangeUserPasswordHandler(hashProvider, userRepo);
  return handler;
};
