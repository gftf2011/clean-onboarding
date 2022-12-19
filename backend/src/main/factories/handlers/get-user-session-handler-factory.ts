import { Handler } from '../../../application/contracts/handlers';
import { GetUserSessionHandler } from '../../../application/handlers';

import {
  JWTTokenProviderCreator,
  UUIDProviderCreator,
} from '../../../infra/providers';

export const getUserSessionHandlerFactory = (): Handler => {
  const uuidProvider = new UUIDProviderCreator();
  const tokenProvider = new JWTTokenProviderCreator(
    process.env.JWT_EXPIRATION_TIME,
  );
  const handler = new GetUserSessionHandler(tokenProvider, uuidProvider);
  return handler;
};
