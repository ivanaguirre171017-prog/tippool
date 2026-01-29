import serverless from 'serverless-http';
import { app } from '../../tippool-backend/src/index';

export const handler = serverless(app);
