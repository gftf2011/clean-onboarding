import { Middleware } from '../../../application/contracts/middlewares';
import { AuthMiddleware } from '../../../application/middlewares';
import { TransactionMiddleware } from '../../../application/middlewares/design/decorators';

import { UserRepository } from '../../../infra/repositories';
import { UserDao } from '../../../infra/dao';
import { PostgresAdapter } from '../../../infra/database/postgres/postgres-adapter';
import {
  JWTTokenProviderCreator,
  UUIDProviderCreator,
} from '../../../infra/providers';
import {
  DatabaseQueryCircuitBreakerProxy,
  DatabaseStatementCircuitBreakerProxy,
} from '../../../infra/database/postgres/circuit-breaker';

export const authMiddlewareFactory = (): Middleware => {
  const postgres = new PostgresAdapter();

  const uuidProvider = new UUIDProviderCreator();
  const tokenProvider = new JWTTokenProviderCreator('1h');

  const userDao = new UserDao({
    read: new DatabaseQueryCircuitBreakerProxy(postgres),
    write: new DatabaseStatementCircuitBreakerProxy(postgres),
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
