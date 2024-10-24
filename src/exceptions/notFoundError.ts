import { CustomError } from './customError';

export class NotFoundError extends CustomError {
    constructor(code: string, message: string, additionalInfo: any = undefined) {
        super(code, message, 404, additionalInfo);
    }
}