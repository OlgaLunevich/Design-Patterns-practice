import { GeometryResultValidator } from '../src/shared/validation/geometry-result-validator';

describe('GeometryResultValidator', () => {
    const validator = new GeometryResultValidator();

    it('accepts positive finite number', () => {
        const result = validator.validate(42.5);

        expect(result.isValid).toBe(true);
        expect(result.value).toBe(42.5);
        expect(result.errors.length).toBe(0);
    });

    it('accepts zero as valid result', () => {
        const result = validator.validate(0);

        expect(result.isValid).toBe(true);
        expect(result.value).toBe(0);
        expect(result.errors.length).toBe(0);
    });

    it('rejects negative number', () => {
        const result = validator.validate(-1);

        expect(result.isValid).toBe(false);
        expect(result.value).toBeUndefined();
        expect(result.errors[0]).toContain('negative');
    });

    it('rejects non-finite number (Infinity)', () => {
        const result = validator.validate(Number.POSITIVE_INFINITY);

        expect(result.isValid).toBe(false);
        expect(result.value).toBeUndefined();
        expect(result.errors[0]).toContain('not a finite');
    });

    it('rejects NaN as invalid result', () => {
        const result = validator.validate(Number.NaN);

        expect(result.isValid).toBe(false);
        expect(result.value).toBeUndefined();
        expect(result.errors.length).toBeGreaterThan(0);
    });
});
