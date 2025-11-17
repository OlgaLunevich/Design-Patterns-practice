import { ShapeFactory } from './shape-factory';
import { Oval } from '../domain/oval';
import { Point } from '../domain/point';
import { OvalInputValidator } from '../validation/oval-input-validator';
import { logger } from '../logger/logger';

export class OvalFactory implements ShapeFactory<Oval> {
    private readonly validator: OvalInputValidator;

    constructor(validator: OvalInputValidator = new OvalInputValidator()) {
        this.validator = validator;
    }

    createFromLine(id: string, line: string): Oval | null {
        const result = this.validator.validate(line);

        if (!result.isValid || !result.value) {
            logger.warn(
                { id, line, errors: result.errors },
                'Invalid input line for Oval; skipping',
            );
            return null;
        }

        const {
            x1, y1, x2, y2,
        } = result.value;

        const firstCorner = new Point(x1, y1);
        const secondCorner = new Point(x2, y2);

        return new Oval(id, firstCorner, secondCorner);
    }
}
