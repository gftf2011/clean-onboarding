import { Handler } from '../../../application/contracts/handlers';
import { CheckUserPasswordHandler } from '../../../application/handlers';

import { HashProvider } from '../../../infra/providers';

export const checkUserPasswordHandlerFactory = (): Handler => {
  const hashProvider = new HashProvider();
  const handler = new CheckUserPasswordHandler(hashProvider);
  return handler;
};
