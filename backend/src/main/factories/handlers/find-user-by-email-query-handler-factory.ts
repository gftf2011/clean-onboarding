import { IQueryHandler } from '../../../application/contracts/handlers';
import { FindUserByEmailQueryHandler } from '../../../application/handlers/queries';

import { UserRepository } from '../../../infra/repositories';
import { UserDao } from '../../../infra/dao';
import { PostgresAdapter } from '../../../infra/database/postgres/postgres-adapter';
import {
  DatabaseQueryCircuitBreaker,
  DatabaseStatementCircuitBreaker,
} from '../../../infra/database/postgres/circuit-breaker';

export const findUserByEmailQueryHandlerFactory = (
  postgres: PostgresAdapter,
): IQueryHandler => {
  const userDao = new UserDao({
    read: new DatabaseQueryCircuitBreaker(postgres),
    write: new DatabaseStatementCircuitBreaker(postgres),
  });
  const userRepo = new UserRepository({
    user: userDao,
  });
  const handler = new FindUserByEmailQueryHandler(userRepo);
  return handler;
};
