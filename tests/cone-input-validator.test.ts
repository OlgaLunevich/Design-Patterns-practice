import { ConeInputValidator } from '../src/shared/validation/cone-input-validator';

describe('ConeInputValidator', () => {
    const validator = new ConeInputValidator();

    it('accepts valid line with 5 numbers and positive radius/height', () => {
        const line = '0 0 0 3 5';

        const result = validator.validate(line);

        expect(result.isValid).toBe(true);
        expect(result.errors.length).toBe(0);
        expect(result.value).toBeDefined();
        expect(result.value?.radius).toBe(3);
        expect(result.value?.height).toBe(5);
    });

    it('rejects line with wrong token count', () => {
        const result = validator.validate('1 2 3 4');

        expect(result.isValid).toBe(false);
        expect(result.value).toBeUndefined();
        expect(result.errors[0]).toContain('Expected 5 values');
    });

    it('rejects line with non numeric token', () => {
        const result = validator.validate('1 2 z 4 5');

        expect(result.isValid).toBe(false);
        expect(result.value).toBeUndefined();
        expect(result.errors[0]).toContain('valid numbers');
    });

    it('rejects non-positive radius or height', () => {
        const result = validator.validate('1 2 3 -1 0');

        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThanOrEqual(1);
        expect(result.value).toBeUndefined();
    });
});
