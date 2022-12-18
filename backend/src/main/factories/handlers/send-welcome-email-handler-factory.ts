import { Handler } from '../../../application/contracts/handlers';
import { SendWelcomeEmailHandler } from '../../../application/handlers';

import {
  NodemailerEmailProvider,
  HandlebarsTemplateProvider,
} from '../../../infra/providers';

export const sendWelcomeEmailHandlerFactory = (): Handler => {
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

  return new SendWelcomeEmailHandler(emailProvider);
};
