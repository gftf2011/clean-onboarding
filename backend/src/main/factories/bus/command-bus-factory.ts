import { ICommandBus } from '../../../application/contracts/bus';

import { CommandBus } from '../../../infra/bus/commands';

import { createUserCommandHandlerFactory } from '../handlers';

export const commandBusFactory = (): ICommandBus => {
  const handlers = [createUserCommandHandlerFactory()];
  const bus = new CommandBus(handlers);
  return bus;
};
