import { Express } from 'express';

import { ExpressRouteAdapter } from '../adapters';
import { signInControllerFactory } from '../factories/controllers';

export default (app: Express): void => {
  const controller = signInControllerFactory();
  app.post('/api/V1/sign-in', ExpressRouteAdapter.adapter(controller));
};
