export class AppError extends Error {
    override readonly name: string = 'AppError';

    constructor(message: string) {
        super(message);
    }
}

