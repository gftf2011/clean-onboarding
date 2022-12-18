import { Handler } from '../../../application/contracts/handlers';
import { CheckUserPasswordHandler } from '../../../application/handlers';

import { HashSha512ProviderCreator } from '../../../infra/providers';

export const checkUserPasswordHandlerFactory = (): Handler => {
  const hashProvider = new HashSha512ProviderCreator();
  const handler = new CheckUserPasswordHandler(hashProvider);
  return handler;
};
