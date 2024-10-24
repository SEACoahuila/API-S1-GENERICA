// Note: Our custom error extends from Error, so we can throw this error as an exception.
export class CustomError extends Error {
    code!: string;
    message!: string;
    status!: number;
    additionalInfo!: any;

    constructor(code: string, message: string, status: number = 500, additionalInfo: any = undefined) {
        super(message);
        this.code = code;
        this.message = message;
        this.status = status;
        this.additionalInfo = additionalInfo;
    }
};
export interface IResponseError {
    code: string;
    message: string;
    additionalInfo?: string;
}