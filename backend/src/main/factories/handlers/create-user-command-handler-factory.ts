import { ICommandHandler } from '../../../application/contracts/handlers';
import { CreateUserCommandHandler } from '../../../application/handlers/commands';

import { UserRepository } from '../../../infra/repositories';
import { UserDao } from '../../../infra/dao';
import { PostgresAdapter } from '../../../infra/database/postgres/postgres-adapter';
import { HashProvider, UUIDProvider } from '../../../infra/providers';
import {
  DatabaseQueryCircuitBreaker,
  DatabaseStatementCircuitBreaker,
} from '../../../infra/database/postgres/circuit-breaker';

export const createUserCommandHandlerFactory = (
  postgres: PostgresAdapter,
): ICommandHandler => {
  const uuidProvider = new UUIDProvider();
  const hashProvider = new HashProvider();

  const userDao = new UserDao({
    read: new DatabaseQueryCircuitBreaker(postgres),
    write: new DatabaseStatementCircuitBreaker(postgres),
  });

  const userRepo = new UserRepository({
    user: userDao,
  });
  const handler = new CreateUserCommandHandler(
    uuidProvider,
    hashProvider,
    userRepo,
  );
  return handler;
};
