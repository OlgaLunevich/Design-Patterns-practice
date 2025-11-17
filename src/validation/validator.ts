import { ValidationResult } from './validation-result';

export interface Validator<TInput, TOutput> {
    validate(input: TInput): ValidationResult<TOutput>;
}
