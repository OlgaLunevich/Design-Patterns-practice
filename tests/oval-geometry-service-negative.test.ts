import { OvalGeometryService } from '../src/application/services/oval-geometry-service';
import { Oval } from '../src/domain/entities/oval';
import { Point } from '../src/domain/entities/point';
import { GeometryResultValidator } from '../src/shared/validation/geometry-result-validator';
import { ValidationResult } from '../src/shared/validation/validation-result';

class AlwaysInvalidGeometryResultValidator extends GeometryResultValidator {
    // переопределяем validate, чтобы возвращать невалидный результат
    // eslint-disable-next-line class-methods-use-this
    validate(value: number): ValidationResult<number> {
        return {
            isValid: false,
            errors: [`Forced invalid for value ${value}`],
        };
    }
}

describe('OvalGeometryService with failing result validator', () => {
    const failingValidator = new AlwaysInvalidGeometryResultValidator();
    const service = new OvalGeometryService(failingValidator);

    const oval = new Oval(
        'oval-invalid',
        new Point(-2, -1),
        new Point(2, 1),
    );

    it('returns 0 area when validator marks result as invalid', () => {
        const area = service.getArea(oval);

        expect(area).toBe(0);
    });

    it('returns 0 perimeter when validator marks result as invalid', () => {
        const perimeter = service.getPerimeterApprox(oval);

        expect(perimeter).toBe(0);
    });
});
