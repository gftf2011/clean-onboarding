import { Handler } from '../../../application/contracts/handlers';
import { SendWelcomeEmailHandler } from '../../../application/handlers';

import {
  NodemailerEmailProviderCreator,
  HandlebarsTemplateProviderCreator,
} from '../../../infra/providers';

export const sendWelcomeEmailHandlerFactory = (): Handler => {
  const templateProvider = new HandlebarsTemplateProviderCreator();
  const emailProvider = new NodemailerEmailProviderCreator(
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
