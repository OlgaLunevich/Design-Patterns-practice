import { ShapeTypeSpecification } from '../src/domain/specifications/shape-type-specification';
import { ShapeIdSpecification } from '../src/domain/specifications/shape-id-specification';
import { FirstQuadrantSpecification } from '../src/domain/specifications/first-quadrant-specification';
import { DistanceRangeSpecification } from '../src/domain/specifications/distance-range-specification';
import { MeasureRangeSpecification } from '../src/domain/specifications/measure-range-specification';

import { Oval } from '../src/domain/entities/oval';
import { Cone } from '../src/domain/entities/cone';
import { Point } from '../src/domain/entities/point';
import { ShapeType } from '../src/domain/shapes/shape';
import { OvalGeometryService } from '../src/application/services/oval-geometry-service';
import { ConeGeometryService } from '../src/application/services/cone-geometry-service';

describe('Specifications', () => {
    const oval = new Oval('oval-1', new Point(-2, -1), new Point(2, 1));
    const ovalFirstQuadrant = new Oval('oval-2', new Point(0, 0), new Point(2, 2));

    const cone = new Cone('cone-1', new Point(1, 1, 0), 1, 2);
    const coneFar = new Cone('cone-2', new Point(10, 10, 0), 1, 1);

    const ovalGeometry = new OvalGeometryService();
    const coneGeometry = new ConeGeometryService();

    // ---------- TYPE ----------
    it('ShapeTypeSpecification works correctly', () => {
        const specOval = new ShapeTypeSpecification(ShapeType.OVAL);
        const specCone = new ShapeTypeSpecification(ShapeType.CONE);

        expect(specOval.isSatisfiedBy(oval)).toBe(true);
        expect(specOval.isSatisfiedBy(cone)).toBe(false);

        expect(specCone.isSatisfiedBy(cone)).toBe(true);
        expect(specCone.isSatisfiedBy(oval)).toBe(false);
    });

    // ---------- ID ----------
    it('ShapeIdSpecification matches ID', () => {
        const spec = new ShapeIdSpecification('oval-1');

        expect(spec.isSatisfiedBy(oval)).toBe(true);
        expect(spec.isSatisfiedBy(ovalFirstQuadrant)).toBe(false);
    });

    // ---------- FIRST QUADRANT ----------
    it('FirstQuadrantSpecification checks center point', () => {
        const spec = new FirstQuadrantSpecification<Oval>((o) => {
            const p1 = o.getFirstCorner();
            const p2 = o.getSecondCorner();
            return new Point((p1.getX() + p2.getX()) / 2, (p1.getY() + p2.getY()) / 2);
        });

        expect(spec.isSatisfiedBy(ovalFirstQuadrant)).toBe(true);
        expect(spec.isSatisfiedBy(oval)).toBe(false); // центр = (0,0)
    });

    // ---------- DISTANCE RANGE ----------
    it('DistanceRangeSpecification filters by distance', () => {
        const specNear = new DistanceRangeSpecification<Cone>(
            c => c.getBaseCenter(),
            0,
            5,
        );

        const specFar = new DistanceRangeSpecification<Cone>(
            c => c.getBaseCenter(),
            8,
            20,
        );

        expect(specNear.isSatisfiedBy(cone)).toBe(true);
        expect(specNear.isSatisfiedBy(coneFar)).toBe(false);

        expect(specFar.isSatisfiedBy(coneFar)).toBe(true);
        expect(specFar.isSatisfiedBy(cone)).toBe(false);
    });

    // ---------- AREA RANGE ----------
    it('MeasureRangeSpecification works for oval area', () => {
        const areaSmall = ovalGeometry.getArea(oval); // около 6.28
        const spec = new MeasureRangeSpecification<Oval>(
            (o) => ovalGeometry.getArea(o),
            5,
            10,
        );

        expect(spec.isSatisfiedBy(oval)).toBe(true);
        expect(spec.isSatisfiedBy(ovalFirstQuadrant)).toBe(false);
    });

    // ---------- VOLUME RANGE ----------
    it('MeasureRangeSpecification works for cone volume', () => {
        const volume = coneGeometry.getVolume(cone);

        const spec = new MeasureRangeSpecification<Cone>(
            c => coneGeometry.getVolume(c),
            volume - 1,
            volume + 1,
        );

        expect(spec.isSatisfiedBy(cone)).toBe(true);
        expect(spec.isSatisfiedBy(coneFar)).toBe(false);
    });
});
