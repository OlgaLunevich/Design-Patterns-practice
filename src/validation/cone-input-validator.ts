import { Validator } from './validator';
import { ValidationResult } from './validation-result';
import { FLOAT_NUMBER_PATTERN, WHITESPACE_SPLIT_PATTERN } from '../constants/regex';

export interface ConeInputData {
    x: number;
    y: number;
    z: number;
    radius: number;
    height: number;
}

export class ConeInputValidator implements Validator<string, ConeInputData> {
    validate(line: string): ValidationResult<ConeInputData> {
        const errors: string[] = [];

        const trimmed = line.trim();
        if (!trimmed) {
            errors.push('Empty line');
            return { isValid: false, errors };
        }

        const tokens = trimmed.split(WHITESPACE_SPLIT_PATTERN);

        if (tokens.length !== 5) {
            errors.push(`Expected 5 values for cone, got ${tokens.length}`);
            return { isValid: false, errors };
        }

        const [xRaw, yRaw, zRaw, radiusRaw, heightRaw] = tokens;

        const allTokens = [xRaw, yRaw, zRaw, radiusRaw, heightRaw];
        const hasInvalidNumber = allTokens.some((token) => !FLOAT_NUMBER_PATTERN.test(token));

        if (hasInvalidNumber) {
            errors.push('All values must be valid numbers');
            return { isValid: false, errors };
        }

        const x = Number(xRaw);
        const y = Number(yRaw);
        const z = Number(zRaw);
        const radius = Number(radiusRaw);
        const height = Number(heightRaw);

        if (radius <= 0) {
            errors.push('Radius must be positive');
        }

        if (height <= 0) {
            errors.push('Height must be positive');
        }

        if (errors.length > 0) {
            return { isValid: false, errors };
        }

        return {
            isValid: true,
            value: {
                x,
                y,
                z,
                radius,
                height,
            },
            errors,
        };
    }
}
