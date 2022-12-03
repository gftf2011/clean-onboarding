import { IQueryHandler } from '../../../application/contracts/handlers';
import { FindUserByEmailQueryHandler } from '../../../application/handlers/queries';

import { UserRepository } from '../../../infra/repositories';
import { UserDao } from '../../../infra/dao';
import { PostgresAdapter } from '../../../infra/database/postgres/postgres-adapter';

export const findUserByEmailQueryHandlerFactory = (): IQueryHandler => {
  const postgresDB = new PostgresAdapter();
  const userDao = new UserDao({
    read: postgresDB,
    write: postgresDB,
  });
  const userRepo = new UserRepository({
    user: userDao,
  });
  const handler = new FindUserByEmailQueryHandler(userRepo);
  return handler;
};