import { RabbitmqActionSubscriber } from '../../infra/queue/rabbitmq/subscriber';
import { ActionSubscriberTransactionDecorator } from '../../infra/queue/rabbitmq/subscriber/design/decorators';

import { sendWelcomeEmailHandlerFactory } from '../factories/handlers';

import { Queue } from '../../application/contracts/queue';
import { ActionSubscriberInitializer } from '../../application/contracts/actions';

export default (queue: Queue): void => {
  const sendWelcomeEmailHandler = sendWelcomeEmailHandlerFactory();
  const subcriber = new ActionSubscriberTransactionDecorator(
    queue,
    new RabbitmqActionSubscriber(queue),
  );
  // eslint-disable-next-line no-new
  new ActionSubscriberInitializer(subcriber, sendWelcomeEmailHandler);
};
