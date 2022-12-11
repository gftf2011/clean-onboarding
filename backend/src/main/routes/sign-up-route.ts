import { Express } from 'express';

import { ExpressRouteAdapter } from '../adapters';
import { signUpControllerFactory } from '../factories/controllers';

export default async (app: Express): Promise<void> => {
  const controller = await signUpControllerFactory();
  app.post('/api/V1/sign-up', ExpressRouteAdapter.adapter(controller));
};
