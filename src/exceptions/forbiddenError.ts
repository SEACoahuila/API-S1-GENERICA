import { CustomError } from './customError';

export class ForbiddenError extends CustomError {
    constructor(code: string, message: string, additionalInfo: any = undefined) {
        super(code, message, 403, additionalInfo);
    }
}