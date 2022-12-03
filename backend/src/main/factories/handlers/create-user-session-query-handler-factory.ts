import { IQueryHandler } from '../../../application/contracts/handlers';
import { CreateUserSessionQueryHandler } from '../../../application/handlers/queries';

import { TokenProvider, UUIDProvider } from '../../../infra/providers';

export const createUserSessionQueryHandlerFactory = (): IQueryHandler => {
  const uuidProvider = new UUIDProvider();
  const tokenProvider = new TokenProvider('1h');
  const handler = new CreateUserSessionQueryHandler(
    tokenProvider,
    uuidProvider,
  );
  return handler;
};
