import { WelcomeEmailEventHandler } from '../../application/handlers/events';

import {
  NodemailerEmailProvider,
  HandlebarsTemplateProvider,
} from '../../infra/providers';
import { RabbitmqEventSubscriber } from '../../infra/queue/rabbitmq/subscriber';
import { RabbitmqAdapter } from '../../infra/queue/rabbitmq/rabbitmq-adapter';

export default async (): Promise<void> => {
  const rabbitmq = new RabbitmqAdapter();

  const templateProvider = new HandlebarsTemplateProvider();
  const emailProvider = new NodemailerEmailProvider(
    {
      host: process.env.ETHEREAL_EMAIL_HOST,
      password: process.env.ETHEREAL_EMAIL_PASSWORD,
      port: Number(process.env.ETHEREAL_EMAIL_PORT),
      username: process.env.ETHEREAL_EMAIL_USER,
    },
    templateProvider,
  );

  const handler = new WelcomeEmailEventHandler(emailProvider);
  const sub = new RabbitmqEventSubscriber(rabbitmq);

  await sub.subscribe(handler);
};
