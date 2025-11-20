import { Validator } from './validator';
import { ValidationResult } from './validation-result';
import { FLOAT_NUMBER_PATTERN, WHITESPACE_SPLIT_PATTERN } from '../constants/regex';

export interface OvalInputData {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

export class OvalInputValidator implements Validator<string, OvalInputData> {
    validate(line: string): ValidationResult<OvalInputData> {
        const errors: string[] = [];

        const trimmed = line.trim();
        if (!trimmed) {
            errors.push('Empty line');
            return { isValid: false, errors };
        }

        const tokens = trimmed.split(WHITESPACE_SPLIT_PATTERN);

        if (tokens.length !== 4) {
            errors.push(`Expected 4 values for oval, got ${tokens.length}`);
            return { isValid: false, errors };
        }

        const [x1Raw, y1Raw, x2Raw, y2Raw] = tokens;

        if (!FLOAT_NUMBER_PATTERN.test(x1Raw)
            || !FLOAT_NUMBER_PATTERN.test(y1Raw)
            || !FLOAT_NUMBER_PATTERN.test(x2Raw)
            || !FLOAT_NUMBER_PATTERN.test(y2Raw)) {
            errors.push('All values must be valid numbers');
            return { isValid: false, errors };
        }

        const x1 = Number(x1Raw);
        const y1 = Number(y1Raw);
        const x2 = Number(x2Raw);
        const y2 = Number(y2Raw);

        return {
            isValid: true,
            value: {
                x1,
                y1,
                x2,
                y2,
            },
            errors,
        };
    }
}
