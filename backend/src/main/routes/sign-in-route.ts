import { Express } from 'express';

import { ExpressRouteAdapter } from '../adapters';
import { signInControllerFactory } from '../factories/controllers';

export default async (app: Express): Promise<void> => {
  const controller = await signInControllerFactory();
  app.post('/api/V1/sign-in', ExpressRouteAdapter.adapter(controller));
};
