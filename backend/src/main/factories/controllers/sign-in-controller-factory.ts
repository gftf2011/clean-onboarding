import { Controller } from '../../../application/contracts/controllers';
import { TransactionController } from '../../../application/controllers/decorators';
import { UserService } from '../../../application/services';
import { SignInController } from '../../../application/controllers';

import { PostgresAdapter } from '../../../infra/database/postgres/postgres-adapter';

import { commandBusFactory, queryBusFactory } from '../bus';

export const signInControllerFactory = (): Controller => {
  const postgres = new PostgresAdapter();
  const queryBus = queryBusFactory(postgres);
  const commandBus = commandBusFactory(postgres);
  const userService = new UserService(commandBus, queryBus);
  const controller = new TransactionController(
    new SignInController(userService, process.env.JWT_SECRET),
    postgres,
  );
  return controller;
};
