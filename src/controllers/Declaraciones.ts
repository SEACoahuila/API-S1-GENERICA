import { NextFunction, Request, Response } from 'express';
import { querySchema } from '../schemas/yup.query';
import { ClientError } from '../exceptions/clientError';
import Declaracion from '../models/declaracion.model';

class Declaraciones {

    static checkRequest = async (req: Request, res: Response, next: NextFunction) => {
        const { body } = req;
        try {
            await querySchema.validate(body);
        } catch (err: object | any) {
            throw new ClientError('e_8001', 'Error en la consulta enviada', `${err.path}: ${err.errors}`);
        }

        next();
    }

    static executeQuery = async (req: Request, res: Response, next: NextFunction) => {

        const data = await Declaracion.query(req.body);

        res.json(data);
    }
}
export default Declaraciones;