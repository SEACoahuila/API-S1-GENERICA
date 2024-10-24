import { CustomError } from './customError';

export class ClientError extends CustomError {
    constructor(code: string, message: string, additionalInfo: any = undefined) {
        super(code, message, 400, additionalInfo);
    }
}