import { Point } from '../src/domain/entities/point';
import { Oval } from '../src/domain/entities/oval';
import { OvalGeometryService } from '../src/application/services/oval-geometry-service';

describe('OvalGeometryService - axis intersections', () => {
    const service = new OvalGeometryService();

    it('returns true when oval intersects only OX within distance', () => {
        // Овал пересекает OX (y изменяет знак), но не охватывает x = 0
        const p1 = new Point(2, -2);
        const p2 = new Point(4, 2);
        const oval = new Oval('oval-ox', p1, p2);

        const result = service.intersectsOnlyOneAxisWithinDistance(oval, 10);

        expect(result).toBe(true);
        expect(service.isValidOval(oval)).toBe(true);
    });

    it('returns true when oval intersects only OY within distance', () => {
        // Овал пересекает OY (x изменяет знак), но по y не переходит через 0
        const p1 = new Point(-2, 2);
        const p2 = new Point(2, 4);
        const oval = new Oval('oval-oy', p1, p2);

        const result = service.intersectsOnlyOneAxisWithinDistance(oval, 10);

        expect(result).toBe(true);
        expect(service.isValidOval(oval)).toBe(true);
    });

    it('returns false when oval intersects both axes', () => {
        // Прямоугольник охватывает и x=0, и y=0
        const p1 = new Point(-2, -2);
        const p2 = new Point(2, 2);
        const oval = new Oval('oval-both', p1, p2);

        const result = service.intersectsOnlyOneAxisWithinDistance(oval, 10);

        expect(result).toBe(false);
    });

    it('returns false when oval does not intersect any axis', () => {
        const p1 = new Point(5, 5);
        const p2 = new Point(7, 7);
        const oval = new Oval('oval-none', p1, p2);

        const result = service.intersectsOnlyOneAxisWithinDistance(oval, 10);

        expect(result).toBe(false);
    });

    it('returns false when intersection is outside given distance', () => {
        // Пересечение с осями далеко от начала координат
        const p1 = new Point(100, -2);
        const p2 = new Point(110, 2);
        const oval = new Oval('oval-far', p1, p2);

        const resultSmallDistance = service.intersectsOnlyOneAxisWithinDistance(oval, 10);
        const resultBigDistance = service.intersectsOnlyOneAxisWithinDistance(oval, 200);

        expect(resultSmallDistance).toBe(false);
        expect(resultBigDistance).toBe(true);
    });
});
