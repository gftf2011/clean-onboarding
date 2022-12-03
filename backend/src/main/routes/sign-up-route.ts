import { Express } from 'express';

import { ExpressRouteAdapter } from '../adapters';
import { signUpControllerFactory } from '../factories/controllers';

export default (app: Express): void => {
  app.post(
    '/api/V1/sign-up',
    ExpressRouteAdapter.adapter(signUpControllerFactory()),
  );
};
