import { Controller } from '../../../application/contracts/controllers';
import { TransactionControllerDecorator } from '../../../application/controllers/design/decorators';
import { UserService } from '../../../application/services';
import { SignInController } from '../../../application/controllers';

import { RabbitmqAdapter } from '../../../infra/queue/rabbitmq/rabbitmq-adapter';
import { PostgresAdapter } from '../../../infra/database/postgres/postgres-adapter';

import { commandBusFactory, queryBusFactory } from '../bus';

export const signInControllerFactory = (): Controller => {
  const postgres = new PostgresAdapter();
  const rabbitmq = new RabbitmqAdapter();

  const queryBus = queryBusFactory(postgres);
  const commandBus = commandBusFactory(postgres, rabbitmq);
  const userService = new UserService(commandBus, queryBus);
  const controller = new TransactionControllerDecorator(
    new SignInController(userService, process.env.JWT_SECRET),
    postgres,
  );
  return controller;
};
