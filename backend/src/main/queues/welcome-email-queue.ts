import { RabbitmqEventSubscriber } from '../../infra/queue/rabbitmq/subscriber';
import { RabbitmqAdapter } from '../../infra/queue/rabbitmq/rabbitmq-adapter';

import { welcomeEmailEventHandlerFactory } from '../factories/handlers';

export default (): void => {
  const queue = new RabbitmqAdapter();
  const welcomeEmailHandler = welcomeEmailEventHandlerFactory();
  // eslint-disable-next-line no-new
  new RabbitmqEventSubscriber(queue, welcomeEmailHandler);
};
