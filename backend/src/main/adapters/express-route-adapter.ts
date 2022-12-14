/* eslint-disable sort-imports */
import { Request, Response } from 'express';

import { Controller } from '../../application/contracts/controllers';
import { HttpRequest } from '../../application/contracts/http';

type Adapter = (req: Request, res: Response) => Promise<void>;

// It uses the adapter design pattern
export class ExpressRouteAdapter {
  static adapter(controller: Controller): Adapter {
    return async (req: Request, res: Response) => {
      const httpRequest: HttpRequest = {
        urlParams: req.params,
        body: req.body,
        headers: req.headers,
      };
      const httpResponse = await controller.handle(httpRequest);
      if (httpResponse.statusCode === 204) {
        res.status(httpResponse.statusCode).end();
      } else {
        /**
         * Necessary use of else to avoid server possible double response
         */
        res.status(httpResponse.statusCode).json(httpResponse.body);
      }
    };
  }
}
