import { Controller } from '../../../application/contracts/controllers';
import { TransactionController } from '../../../application/controllers/decorators';
import { UserService } from '../../../application/services';
import { SignUpController } from '../../../application/controllers';

import { RabbitmqAdapter } from '../../../infra/queue/rabbitmq/rabbitmq-adapter';
import { PostgresAdapter } from '../../../infra/database/postgres/postgres-adapter';

import { commandBusFactory, queryBusFactory } from '../bus';

export const signUpControllerFactory = (): Controller => {
  const postgres = new PostgresAdapter();
  const rabbitmq = new RabbitmqAdapter();

  const queryBus = queryBusFactory(postgres);
  const commandBus = commandBusFactory(postgres, rabbitmq);
  const userService = new UserService(commandBus, queryBus);
  const controller = new TransactionController(
    new SignUpController(userService),
    postgres,
  );

  return controller;
};
