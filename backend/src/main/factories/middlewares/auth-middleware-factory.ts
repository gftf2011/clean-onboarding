import { Middleware } from '../../../application/contracts/middlewares';
import { AuthMiddleware } from '../../../application/middlewares';
import { TransactionMiddleware } from '../../../application/middlewares/decorators';

import { UserRepository } from '../../../infra/repositories';
import { UserDao } from '../../../infra/dao';
import { PostgresAdapter } from '../../../infra/database/postgres/postgres-adapter';
import { TokenProvider, UUIDProvider } from '../../../infra/providers';
import {
  DatabaseQueryCircuitBreaker,
  DatabaseStatementCircuitBreaker,
} from '../../../infra/database/postgres/circuit-breaker';

export const authMiddlewareFactory = (): Middleware => {
  const postgres = new PostgresAdapter();

  const uuidProvider = new UUIDProvider();
  const tokenProvider = new TokenProvider('1h');

  const userDao = new UserDao({
    read: new DatabaseQueryCircuitBreaker(postgres),
    write: new DatabaseStatementCircuitBreaker(postgres),
  });

  const userRepo = new UserRepository({
    user: userDao,
  });
  const middleware = new TransactionMiddleware(
    new AuthMiddleware(
      uuidProvider,
      userRepo,
      tokenProvider,
      process.env.JWT_SECRET,
    ),
    postgres,
  );
  return middleware;
};
