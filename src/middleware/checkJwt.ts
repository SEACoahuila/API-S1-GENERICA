import { Request, Response, NextFunction } from 'express';
import { verify, JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { ForbiddenError } from '../exceptions/forbiddenError';
import debug from 'debug';

const log: debug.IDebugger = debug('app:checkJWT');

export interface CustomRequest extends Request {
    token: JwtPayload;
}

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    const token = <string>req.headers['authorization'];
    const jwt = token?.split(' ')[1];
    let jwtPayload;

    log("Token: ", jwt);
    try {
        jwtPayload = <any>verify(jwt, config.jwt.secret!, {
            complete: true,
            audience: config.jwt.audience,
            issuer: config.jwt.issuer,
            algorithms: ['HS256'],
            ignoreExpiration: false,
            ignoreNotBefore: false
        });

        (req as CustomRequest).token = jwtPayload;
    } catch (error: any) {
        let message = 'El token no existe o no es valido';

        switch (error.name) {
            case 'TokenExpiredError':
                message = 'El token ha expirado.'
                break;
            case 'JsonWebTokenError':
                message = 'No se recibio un token valido.'
                break;
            default:
                message = 'Error desconocido al validar el token.'
                break;
        }

        throw new ForbiddenError('e_701', message, error.message);
    }

    if (!jwtPayload.payload.scope.includes('read')) {
        throw new ForbiddenError('e_702', 'No tiene el permiso necesario.');
    }

    next();
};