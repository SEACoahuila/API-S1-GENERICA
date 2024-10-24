import { Router } from 'express';
import declaraciones from './declaraciones'

const routes = Router();
routes.use('/v2', declaraciones)

export default routes;