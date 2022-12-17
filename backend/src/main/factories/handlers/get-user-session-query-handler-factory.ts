import { IQueryHandler } from '../../../application/contracts/handlers';
import { GetUserSessionQueryHandler } from '../../../application/handlers/queries';

import { TokenProvider, UUIDProvider } from '../../../infra/providers';

export const getUserSessionQueryHandlerFactory = (): IQueryHandler => {
  const uuidProvider = new UUIDProvider();
  const tokenProvider = new TokenProvider('1h');
  const handler = new GetUserSessionQueryHandler(tokenProvider, uuidProvider);
  return handler;
};
