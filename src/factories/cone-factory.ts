import { ShapeFactory } from './shape-factory';
import { Cone } from '../domain/cone';
import { Point } from '../domain/point';
import { ConeInputValidator } from '../validation/cone-input-validator';
import { logger } from '../logger/logger';

export class ConeFactory implements ShapeFactory<Cone> {
    private readonly validator: ConeInputValidator;

    constructor(validator: ConeInputValidator = new ConeInputValidator()) {
        this.validator = validator;
    }

    createFromLine(id: string, line: string): Cone | null {
        const result = this.validator.validate(line);

        if (!result.isValid || !result.value) {
            logger.warn(
                { id, line, errors: result.errors },
                'Invalid input line for Cone; skipping',
            );
            return null;
        }

        const {
            x, y, z, radius, height,
        } = result.value;

        const baseCenter = new Point(x, y, z);

        return new Cone(id, baseCenter, radius, height);
    }
}
