import { Express, NextFunction, Request, Response } from 'express';

export default (app: Express) => {
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.type('json');
    next();
  });
};
