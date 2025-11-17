import { AppError } from './app-error';

export class ValidationError extends AppError {
    override readonly name: string = 'ValidationError';

    constructor(message: string) {
        super(message);
    }
}