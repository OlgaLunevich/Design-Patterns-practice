import { ValidationResult } from './validation-result';
import { Validator } from './validator';

export class GeometryResultValidator implements Validator<number, number> {
    validate(value: number): ValidationResult<number> {
        const errors: string[] = [];

        if (!Number.isFinite(value)) {
            errors.push('Result is not a finite number');
        }

        if (value < 0) {
            errors.push('Result must not be negative');
        }

        if (errors.length > 0) {
            return {
                isValid: false,
                errors,
            };
        }

        return {
            isValid: true,
            value,
            errors,
        };
    }
}
