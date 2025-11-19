import { Point } from '../src/domain/point';
import { Oval } from '../src/domain/oval';
import { OvalGeometryService } from '../src/services/oval-geometry-service';
import { PI } from '../src/constants/math';

describe('OvalGeometryService', () => {
    const service = new OvalGeometryService();

    it('calculates area correctly for simple oval', () => {
        const p1 = new Point(-2, -1);
        const p2 = new Point(2, 1);
        const oval = new Oval('oval-1', p1, p2);

        const area = service.getArea(oval);

        const expectedA = 2; // semi-axis along x
        const expectedB = 1; // semi-axis along y
        const expectedArea = PI * expectedA * expectedB;

        expect(area).toBeGreaterThan(0);
        expect(Math.abs(area - expectedArea)).toBeLessThan(1e-6);
    });

    it('recognizes circle when semi-axes are equal', () => {
        const p1 = new Point(-1, -1);
        const p2 = new Point(1, 1);
        const oval = new Oval('oval-2', p1, p2);

        expect(service.isCircle(oval)).toBe(true);

        const perimeter = service.getPerimeterApprox(oval);
        expect(perimeter).toBeGreaterThan(0);
    });

    it('checks intersection with only one axis within distance', () => {
        const p1 = new Point(1, -2);
        const p2 = new Point(3, 2);
        const oval = new Oval('oval-3', p1, p2);

        const intersectsOnlyOne = service.intersectsOnlyOneAxisWithinDistance(oval, 5);

        expect(intersectsOnlyOne).toBe(true);
        expect(service.isValidOval(oval)).toBe(true);
    });

    it('returns false for invalid oval points lying on a horizontal line', () => {
        const p1 = new Point(1, 2);
        const p2 = new Point(5, 2); // y1 === y2 -> не образуют овал по определению
        const oval = new Oval('oval-invalid', p1, p2);

        expect(service.isValidOval(oval)).toBe(false);
        expect(service.arePointsFormOval(oval)).toBe(false);
    });

});
