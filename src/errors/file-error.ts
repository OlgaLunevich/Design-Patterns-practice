import { AppError } from './app-error';

export class FileError extends AppError {
    override readonly name: string = 'FileError';

    constructor(message: string) {
        super(message);
    }
}
