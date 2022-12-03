import { Controller } from '../../../application/contracts/controllers';
import { TransactionController } from '../../../application/controllers/decorators';
import { UserService } from '../../../application/services';
import { SignUpController } from '../../../application/controllers';

import { PostgresAdapter } from '../../../infra/database/postgres/postgres-adapter';

import { commandBusFactory, queryBusFactory } from '../bus';

export const signUpControllerFactory = (): Controller => {
  const queryBus = queryBusFactory();
  const commandBus = commandBusFactory();
  const postgresDB = new PostgresAdapter();
  const userService = new UserService(commandBus, queryBus);
  const controller = new TransactionController(
    new SignUpController(userService),
    postgresDB,
  );

  return controller;
};
