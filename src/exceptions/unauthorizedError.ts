import { CustomError } from './customError';

export class UnauthorizedError extends CustomError {
    constructor(code: string, message: string, additionalInfo: any = undefined) {
        super(code, message, 401, additionalInfo);
    }
}