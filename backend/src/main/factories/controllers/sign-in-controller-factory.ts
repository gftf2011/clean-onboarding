import { Controller } from '../../../application/contracts/controllers';

import { UserService } from '../../../application/services';
import { SignInController } from '../../../application/controllers';

import { commandBusFactory, queryBusFactory } from '../bus';

export const signInControllerFactory = (): Controller => {
  const queryBus = queryBusFactory();
  const commandBus = commandBusFactory();
  const userService = new UserService(commandBus, queryBus);
  const controller = new SignInController(userService, process.env.JWT_SECRET);
  return controller;
};
