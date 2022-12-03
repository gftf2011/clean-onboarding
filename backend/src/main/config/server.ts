import setupRoutes from './routes';
import setupMiddlewares from './middlewares';

import { ExpressAdapter } from '../../infra/server/express/express-adapter';

const server = ExpressAdapter.getInstance().getServer();

setupMiddlewares(server);
setupRoutes(server);

export default server;
