import { OvalInputValidator } from '../src/validation/oval-input-validator';

describe('OvalInputValidator', () => {
    const validator = new OvalInputValidator();

    it('accepts valid line with 4 numbers', () => {
        const line = '1.0 2.0 3.5 4.0';

        const result = validator.validate(line);

        expect(result.isValid).toBe(true);
        expect(result.errors.length).toBe(0);
        expect(result.value).toBeDefined();
        expect(result.value?.x1).toBe(1.0);
        expect(result.value?.y2).toBe(4.0);
    });

    it('rejects empty line', () => {
        const result = validator.validate('   ');

        expect(result.isValid).toBe(false);
        expect(result.value).toBeUndefined();
        expect(result.errors.length).toBeGreaterThan(0);
    });

    it('rejects line with wrong number of tokens', () => {
        const result = validator.validate('1.0 2.0 3.0');

        expect(result.isValid).toBe(false);
        expect(result.errors[0]).toContain('Expected 4 values');
        expect(result.value).toBeUndefined();
    });

    it('rejects line with invalid number token', () => {
        const result = validator.validate('1.0 2a.0 3.0 4.0');

        expect(result.isValid).toBe(false);
        expect(result.errors[0]).toContain('valid numbers');
        expect(result.value).toBeUndefined();
    });
});
