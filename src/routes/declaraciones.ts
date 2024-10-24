import { Router } from 'express';
import Declaraciones from '../controllers/Declaraciones';
import { asyncHandler } from '../middleware/asyncHandler';
import { checkJwt } from '../middleware/checkJwt';

const router = Router();

const validations = [checkJwt, asyncHandler(Declaraciones.checkRequest)];

router.post('/declaraciones', validations, asyncHandler(Declaraciones.executeQuery));

export default router;