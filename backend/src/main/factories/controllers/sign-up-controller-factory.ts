import { Controller } from '../../../application/contracts/controllers';

import { UserService } from '../../../application/services';
import { SignUpController } from '../../../application/controllers';

import { commandBusFactory, queryBusFactory } from '../bus';

export const signUpControllerFactory = (): Controller => {
  const queryBus = queryBusFactory();
  const commandBus = commandBusFactory();
  const userService = new UserService(commandBus, queryBus);
  const controller = new SignUpController(userService);
  return controller;
};
