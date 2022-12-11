import { readdirSync } from 'fs';

export default (): void => {
  readdirSync(`${__dirname}/../queues`).forEach(async file => {
    (await import(`${__dirname}/../queues/${file}`)).default();
  });
};
