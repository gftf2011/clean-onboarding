import { ICommandHandler } from '../../../application/contracts/handlers';
import { ChangeUserPasswordHandler } from '../../../application/handlers/commands';

import { UserRepository } from '../../../infra/repositories';
import { UserDao } from '../../../infra/dao';
import { PostgresAdapter } from '../../../infra/database/postgres/postgres-adapter';
import { HashProvider } from '../../../infra/providers';
import {
  DatabaseQueryCircuitBreaker,
  DatabaseStatementCircuitBreaker,
} from '../../../infra/database/postgres/circuit-breaker';

export const changeUserPasswordCommandHandlerFactory = (
  postgres: PostgresAdapter,
): ICommandHandler => {
  const hashProvider = new HashProvider();

  const userDao = new UserDao({
    read: new DatabaseQueryCircuitBreaker(postgres),
    write: new DatabaseStatementCircuitBreaker(postgres),
  });

  const userRepo = new UserRepository({
    user: userDao,
  });
  const handler = new ChangeUserPasswordHandler(hashProvider, userRepo);
  return handler;
};
