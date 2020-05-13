import { Router, json } from 'express';
import appointments from './appointments.routes';

const routes = Router();

routes.use(json);

routes.use('/appointments', appointments);

export default routes;
