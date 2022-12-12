import { RabbitmqEventSubscriber } from '../../infra/queue/rabbitmq/subscriber';

import { welcomeEmailEventHandlerFactory } from '../factories/handlers';

import { IQueue } from '../../application/contracts/queue';

export default (queue: IQueue): void => {
  const welcomeEmailHandler = welcomeEmailEventHandlerFactory();
  // eslint-disable-next-line no-new
  new RabbitmqEventSubscriber(queue, welcomeEmailHandler);
};
