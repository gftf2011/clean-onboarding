import { Handler } from '../../../application/contracts/handlers';
import { GetUserSessionHandler } from '../../../application/handlers';

import { TokenProvider, UUIDProvider } from '../../../infra/providers';

export const getUserSessionHandlerFactory = (): Handler => {
  const uuidProvider = new UUIDProvider();
  const tokenProvider = new TokenProvider('1h');
  const handler = new GetUserSessionHandler(tokenProvider, uuidProvider);
  return handler;
};
