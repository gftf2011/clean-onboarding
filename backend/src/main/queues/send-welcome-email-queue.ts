import { RabbitmqActionSubscriber } from '../../infra/queue/rabbitmq/subscriber';

import { sendWelcomeEmailHandlerFactory } from '../factories/handlers';

import { Queue } from '../../application/contracts/queue';

export default (queue: Queue): void => {
  const sendWelcomeEmailHandler = sendWelcomeEmailHandlerFactory();
  // eslint-disable-next-line no-new
  new RabbitmqActionSubscriber(queue, sendWelcomeEmailHandler);
};
