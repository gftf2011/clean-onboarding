import { Handler } from '../../../application/contracts/handlers';
import { IQueue } from '../../../application/contracts/queue';
import { CreateUserHandler } from '../../../application/handlers';

import { UserRepository } from '../../../infra/repositories';
import { UserDao } from '../../../infra/dao';
import { PostgresAdapter } from '../../../infra/database/postgres/postgres-adapter';
import { HashProvider, UUIDProvider } from '../../../infra/providers';
import {
  DatabaseQueryCircuitBreaker,
  DatabaseStatementCircuitBreaker,
} from '../../../infra/database/postgres/circuit-breaker';
import { RabbitmqActionPublisher } from '../../../infra/queue/rabbitmq/publisher';

export const createUserHandlerFactory = (
  postgres: PostgresAdapter,
  queue: IQueue,
): Handler => {
  const uuidProvider = new UUIDProvider();
  const hashProvider = new HashProvider();

  const publisher = new RabbitmqActionPublisher(queue);

  const userDao = new UserDao({
    read: new DatabaseQueryCircuitBreaker(postgres),
    write: new DatabaseStatementCircuitBreaker(postgres),
  });

  const userRepo = new UserRepository({
    user: userDao,
  });
  const handler = new CreateUserHandler(
    uuidProvider,
    hashProvider,
    userRepo,
    publisher,
  );
  return handler;
};
