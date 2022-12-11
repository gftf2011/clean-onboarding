import setupQueues from './queues';

import { RabbitmqConnection } from '../../infra/queue/rabbitmq/connection';

const broker = async () => {
  let connection = RabbitmqConnection.getInstance().getConnection();
  while (!connection) {
    connection = RabbitmqConnection.getInstance().getConnection();
  }
  setupQueues();
};

export default broker;
