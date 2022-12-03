import { IQueryHandler } from '../../../application/contracts/handlers';
import { CheckUserPasswordQueryHandler } from '../../../application/handlers/queries';

import { HashProvider } from '../../../infra/providers';

export const checkUserPasswordQueryHandlerFactory = (): IQueryHandler => {
  const hashProvider = new HashProvider();
  const handler = new CheckUserPasswordQueryHandler(hashProvider);
  return handler;
};
