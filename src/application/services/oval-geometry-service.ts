import { Oval } from '../../domain/entities/oval';
import { GeometryResultValidator } from '../../shared/validation/geometry-result-validator';
import { logger } from '../../infrastructure/logger/logger';
import { EPSILON, PI } from '../../shared/constants/math';

export class OvalGeometryService {
    private readonly resultValidator: GeometryResultValidator;

    constructor(resultValidator: GeometryResultValidator = new GeometryResultValidator()) {
        this.resultValidator = resultValidator;
    }

    private getSemiAxes(oval: Oval): { a: number; b: number } {
        const first = oval.getFirstCorner();
        const second = oval.getSecondCorner();

        const a = Math.abs(second.getX() - first.getX()) / 2;
        const b = Math.abs(second.getY() - first.getY()) / 2;

        return { a, b };
    }

    private getCenter(oval: Oval): { cx: number; cy: number } {
        const first = oval.getFirstCorner();
        const second = oval.getSecondCorner();

        const cx = (first.getX() + second.getX()) / 2;
        const cy = (first.getY() + second.getY()) / 2;

        return { cx, cy };
    }

    isValidOval(oval: Oval): boolean {
        const { a, b } = this.getSemiAxes(oval);
        return a > 0 && b > 0;
    }

    getArea(oval: Oval): number {
        const { a, b } = this.getSemiAxes(oval);
        const rawArea = PI * a * b;

        const result = this.resultValidator.validate(rawArea);

        if (!result.isValid || result.value === undefined) {
            logger.error({ errors: result.errors }, 'Invalid area calculated for oval');
            return 0;
        }

        return result.value;
    }

    /**
     * Приближённый периметр эллипса по формуле Рамануджана.
     */
    getPerimeterApprox(oval: Oval): number {
        const { a, b } = this.getSemiAxes(oval);

        const h = ((a - b) ** 2) / ((a + b) ** 2);

        const rawPerimeter = PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));

        const result = this.resultValidator.validate(rawPerimeter);

        if (!result.isValid || result.value === undefined) {
            logger.error({ errors: result.errors }, 'Invalid perimeter calculated for oval');
            return 0;
        }

        return result.value;
    }

    isCircle(oval: Oval): boolean {
        const { a, b } = this.getSemiAxes(oval);
        return Math.abs(a - b) < EPSILON;
    }

    /**
     * Проверяет, пересекает ли овал ТОЛЬКО ОДНУ из осей (OX или OY)
     * на расстоянии не более distance от начала координат.
     *
     * Упрощённая логика:
     * - строим ограничивающий прямоугольник;
     * - смотрим, пересекает ли он ось OX (y=0) и/или OY (x=0)
     *   в пределах [-distance, distance].
     */
    intersectsOnlyOneAxisWithinDistance(oval: Oval, distance: number): boolean {
        const first = oval.getFirstCorner();
        const second = oval.getSecondCorner();

        const minX = Math.min(first.getX(), second.getX());
        const maxX = Math.max(first.getX(), second.getX());
        const minY = Math.min(first.getY(), second.getY());
        const maxY = Math.max(first.getY(), second.getY());

        const intersectsOX =
            minY <= 0 && maxY >= 0 && // пересекает прямую y=0
            (minX <= distance && maxX >= -distance); // в пределах по x

        const intersectsOY =
            minX <= 0 && maxX >= 0 && // пересекает прямую x=0
            (minY <= distance && maxY >= -distance); // в пределах по y

        return (intersectsOX && !intersectsOY) || (!intersectsOX && intersectsOY);
    }

    /**
     * Соответствуют ли две точки определению овала:
     * не лежат ли они на одной вертикальной или горизонтальной прямой.
     * Для наших данных это эквивалентно проверке a > 0 и b > 0.
     */
    arePointsFormOval(oval: Oval): boolean {
        return this.isValidOval(oval);
    }

}
