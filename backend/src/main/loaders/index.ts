import { PostgresConnection } from '../../infra/database/postgres/connection';
import { RabbitmqConnection } from '../../infra/queue/rabbitmq/connection';

export const loader = async (): Promise<void> => {
  await Promise.all([
    PostgresConnection.getInstance().connect({
      idleInTransactionSessionTimeout: 10000,
      queryTimeout: 2500,
      statementTimeout: 2500,
      connectionTimeout: 2500,
      database: process.env.POSTGRES_DB,
      host: process.env.POSTGRES_HOST,
      idleTimeout: 10000,
      max: Number(process.env.POSTGRES_MAX),
      password: process.env.POSTGRES_PASSWORD,
      port: Number(process.env.POSTGRES_PORT),
      user: process.env.POSTGRES_USER,
    }),
    RabbitmqConnection.getInstance().connect({
      username: process.env.RABBITMQ_USER,
      password: process.env.RABBITMQ_PASS,
      port: Number(process.env.RABBITMQ_PORT),
      hostname: process.env.RABBITMQ_HOST,
    }),
  ]);
};
