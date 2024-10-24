import { Request, Response, NextFunction } from 'express';
import { CustomError, IResponseError } from '../exceptions/customError';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    if (!(err instanceof CustomError)) {
        res.status(500).send(
            JSON.stringify({
                code: 'e_501',
                message: 'Server error, please try again later',
                additionalInfo: err.message
            })
        );
    } else {
        const customError = err as CustomError;
        let response = {
            code: customError?.code,
            message: customError.message
        } as IResponseError;
        // Check if there is more info to return.
        if (customError.additionalInfo) response.additionalInfo = customError.additionalInfo;
        res.status(customError.status).type('json').send(JSON.stringify(response));
    }
}