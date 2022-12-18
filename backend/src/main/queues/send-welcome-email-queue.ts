import { RabbitmqActionSubscriber } from '../../infra/queue/rabbitmq/subscriber';

import { sendWelcomeEmailHandlerFactory } from '../factories/handlers';

import { IQueue } from '../../application/contracts/queue';

export default (queue: IQueue): void => {
  const sendWelcomeEmailHandler = sendWelcomeEmailHandlerFactory();
  // eslint-disable-next-line no-new
  new RabbitmqActionSubscriber(queue, sendWelcomeEmailHandler);
};
