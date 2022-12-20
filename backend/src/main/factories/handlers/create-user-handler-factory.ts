import { Handler } from '../../../application/contracts/handlers';
import { Queue } from '../../../application/contracts/queue';
import { CreateUserHandler } from '../../../application/handlers';

import { RemoteUserRepositoryFactory } from '../../../infra/repositories';
import { UserDao } from '../../../infra/dao';
import { PostgresAdapter } from '../../../infra/database/postgres/postgres-adapter';
import {
  HashSha512ProviderCreator,
  UUIDProviderCreator,
} from '../../../infra/providers';
import {
  DatabaseQueryCircuitBreakerProxy,
  DatabaseStatementCircuitBreakerProxy,
} from '../../../infra/database/postgres/circuit-breaker';
import { RabbitmqActionPublisherDecorator } from '../../../infra/queue/rabbitmq/publisher';
import { ActionPublisherTransaction } from '../../../infra/queue/rabbitmq/publisher/design/decorators';

export const createUserHandlerFactory = (
  postgres: PostgresAdapter,
  queue: Queue,
): Handler => {
  const uuidProvider = new UUIDProviderCreator();
  const hashProvider = new HashSha512ProviderCreator();

  const publisher = new ActionPublisherTransaction(
    queue,
    new RabbitmqActionPublisherDecorator(queue),
  );

  const userDao = new UserDao({
    read: new DatabaseQueryCircuitBreakerProxy(postgres),
    write: new DatabaseStatementCircuitBreakerProxy(postgres),
  });

  const userRepo = new RemoteUserRepositoryFactory(userDao).createRepository();
  const handler = new CreateUserHandler(
    uuidProvider,
    hashProvider,
    userRepo,
    publisher,
  );
  return handler;
};
