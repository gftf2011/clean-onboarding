import { readdirSync } from 'fs';

import { RabbitmqAdapter } from '../../infra/queue/rabbitmq/rabbitmq-adapter';

export default (): void => {
  readdirSync(`${__dirname}/../queues`).forEach(async file => {
    const queue = new RabbitmqAdapter();
    (await import(`${__dirname}/../queues/${file}`)).default(queue);
  });
};
