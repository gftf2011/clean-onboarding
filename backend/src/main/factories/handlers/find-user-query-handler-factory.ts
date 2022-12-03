import { IQueryHandler } from '../../../application/contracts/handlers';
import { FindUserQueryHandler } from '../../../application/handlers/queries';

import { UserRepository } from '../../../infra/repositories';
import { UserDao } from '../../../infra/dao';
import { PostgresAdapter } from '../../../infra/database/postgres/postgres-adapter';
import {
  CircuitBreakerQuery,
  DatabaseStatementCircuitBreaker,
} from '../../../infra/database/postgres/circuit-breaker';

export const findUserQueryHandlerFactory = (): IQueryHandler => {
  const postgresDB = new PostgresAdapter();
  const userDao = new UserDao({
    read: new CircuitBreakerQuery(postgresDB),
    write: new DatabaseStatementCircuitBreaker(postgresDB),
  });
  const userRepo = new UserRepository({
    user: userDao,
  });
  const handler = new FindUserQueryHandler(userRepo);
  return handler;
};
