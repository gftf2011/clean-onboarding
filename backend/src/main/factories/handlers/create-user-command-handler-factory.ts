import { ICommandHandler } from '../../../application/contracts/handlers';
import { CreateUserCommandHandler } from '../../../application/handlers/commands';

import { UserRepository } from '../../../infra/repositories';
import { UserDao } from '../../../infra/dao';
import { PostgresAdapter } from '../../../infra/database/postgres/postgres-adapter';
import { HashProvider, UUIDProvider } from '../../../infra/providers';
import {
  CircuitBreakerQuery,
  DatabaseStatementCircuitBreaker,
} from '../../../infra/database/postgres/circuit-breaker';

export const createUserCommandHandlerFactory = (): ICommandHandler => {
  const uuidProvider = new UUIDProvider();
  const hashProvider = new HashProvider();

  const postgresDB = new PostgresAdapter();
  const userDao = new UserDao({
    read: new CircuitBreakerQuery(postgresDB),
    write: new DatabaseStatementCircuitBreaker(postgresDB),
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
