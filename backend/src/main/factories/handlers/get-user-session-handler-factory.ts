import { Handler } from '../../../application/contracts/handlers';
import { GetUserSessionHandler } from '../../../application/handlers';

import { JWTTokenProvider, UUIDProvider } from '../../../infra/providers';

export const getUserSessionHandlerFactory = (): Handler => {
  const uuidProvider = new UUIDProvider();
  const tokenProvider = new JWTTokenProvider('1h');
  const handler = new GetUserSessionHandler(tokenProvider, uuidProvider);
  return handler;
};
