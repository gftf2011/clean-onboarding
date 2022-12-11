import { Express } from 'express';

import { readdirSync } from 'fs';

export default (app: Express): void => {
  readdirSync(`${__dirname}/../routes`).forEach(async file => {
    await (await import(`${__dirname}/../routes/${file}`)).default(app);
  });
};
