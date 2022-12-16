import { Express } from 'express';

import { ExpressMiddlewareAdapter, ExpressRouteAdapter } from '../adapters';
import { changeUserPasswordControllerFactory } from '../factories/controllers';
import { authMiddlewareFactory } from '../factories/middlewares';

export default (app: Express): void => {
  const controller = changeUserPasswordControllerFactory();
  const middleware = authMiddlewareFactory();

  app.post(
    '/api/V1/change-user-password',
    ExpressMiddlewareAdapter.adapter(middleware),
    ExpressRouteAdapter.adapter(controller),
  );
};
