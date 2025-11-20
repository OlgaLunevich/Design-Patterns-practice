import { ConeGeometryService } from '../src/application/services/cone-geometry-service';
import { Cone } from '../src/domain/entities/cone';
import { Point } from '../src/domain/entities/point';
import { GeometryResultValidator } from '../src/shared/validation/geometry-result-validator';
import { ValidationResult } from '../src/shared/validation/validation-result';

class AlwaysInvalidGeometryResultValidator extends GeometryResultValidator {
    // eslint-disable-next-line class-methods-use-this
    validate(value: number): ValidationResult<number> {
        return {
            isValid: false,
            errors: [`Forced invalid for value ${value}`],
        };
    }
}

describe('ConeGeometryService with failing result validator', () => {
    const failingValidator = new AlwaysInvalidGeometryResultValidator();
    const service = new ConeGeometryService(failingValidator);

    const cone = new Cone(
        'cone-invalid',
        new Point(0, 0, 0),
        3,
        5,
    );

    it('returns 0 volume when validator marks result as invalid', () => {
        const volume = service.getVolume(cone);

        expect(volume).toBe(0);
    });

    it('returns 0 surface area when validator marks result as invalid', () => {
        const area = service.getSurfaceArea(cone);

        expect(area).toBe(0);
    });
});
