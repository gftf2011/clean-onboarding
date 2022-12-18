import { Handler } from '../../../application/contracts/handlers';
import { CheckUserPasswordHandler } from '../../../application/handlers';

import { HashSha512Provider } from '../../../infra/providers';

export const checkUserPasswordHandlerFactory = (): Handler => {
  const hashProvider = new HashSha512Provider();
  const handler = new CheckUserPasswordHandler(hashProvider);
  return handler;
};
