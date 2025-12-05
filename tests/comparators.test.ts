import { InMemoryShapeRepository } from '../src/infrastructure/repositories/in-memory-shape-repository';
import { Shape, ShapeType } from '../src/domain/shapes/shape';
import { Oval } from '../src/domain/entities/oval';
import { Cone } from '../src/domain/entities/cone';
import { Point } from '../src/domain/entities/point';

import { ShapeIdComparator } from '../src/domain/comparators/shape-id-comparator';
import { ShapeTypeComparator } from '../src/domain/comparators/shape-type-comparator';
import { OvalFirstPointXComparator } from '../src/domain/comparators/oval-first-point-x-comparator';
import { ConeBaseCenterYComparator } from '../src/domain/comparators/cone-base-center-y-comparator';

describe('Comparators', () => {
    let repository: InMemoryShapeRepository<Shape>;

    let oval1: Oval;
    let oval2: Oval;
    let cone1: Cone;
    let cone2: Cone;

    beforeEach(() => {
        repository = new InMemoryShapeRepository<Shape>();

        // IDs специально в "разном порядке"
        oval1 = new Oval(
            'shape-10',
            new Point(-2, -1),
            new Point(2, 1),
        );
        oval2 = new Oval(
            'shape-2',
            new Point(5, 0),
            new Point(7, 2),
        );

        cone1 = new Cone(
            'shape-3',
            new Point(0, -5, 0),
            1,
            3,
        );
        cone2 = new Cone(
            'shape-1',
            new Point(0, 10, 0),
            2,
            4,
        );

        repository.addMany([oval1, oval2, cone1, cone2]);
    });

    it('sorts shapes by id using ShapeIdComparator', () => {
        const shapes = repository.getAll();

        const comparator = new ShapeIdComparator<Shape>();
        const sorted = [...shapes].sort((a, b) => comparator.compare(a, b));

        const ids = sorted.map((s) => s.id);

        // лексикографический порядок
        expect(ids[0]).toBe('shape-1');
        expect(ids[1]).toBe('shape-10');
        expect(ids[2]).toBe('shape-2');
        expect(ids[3]).toBe('shape-3');

        expect(ids).toEqual(['shape-1', 'shape-10', 'shape-2', 'shape-3']);
    });

    it('sorts shapes by type using ShapeTypeComparator', () => {
        const shapes = repository.getAll();

        const comparator = new ShapeTypeComparator<Shape>();
        const sorted = [...shapes].sort((a, b) => comparator.compare(a, b));

        const typesOrder = sorted.map((s) => s.type);

        // Значения enum ShapeType сравниваются как строки ('CONE', 'OVAL')
        // поэтому сначала будут все CONE, потом OVAL
        expect(typesOrder[0]).toBe(ShapeType.CONE);
        expect(typesOrder[1]).toBe(ShapeType.CONE);
        expect(typesOrder[2]).toBe(ShapeType.OVAL);
        expect(typesOrder[3]).toBe(ShapeType.OVAL);
    });

    it('sorts ovals by X of first corner using OvalFirstPointXComparator', () => {
        const ovals = [oval1, oval2];

        // oval1: firstCorner.x = -2
        // oval2: firstCorner.x = 5
        const comparator = new OvalFirstPointXComparator();
        const sorted = [...ovals].sort((a, b) => comparator.compare(a, b));

        const ids = sorted.map((o) => o.id);

        expect(ids[0]).toBe('shape-10'); // -2 < 5
        expect(ids[1]).toBe('shape-2');
    });

    it('sorts cones by Y of base center using ConeBaseCenterYComparator', () => {
        const cones = [cone1, cone2];

        // cone1: baseCenter.y = -5
        // cone2: baseCenter.y = 10
        const comparator = new ConeBaseCenterYComparator();
        const sorted = [...cones].sort((a, b) => comparator.compare(a, b));

        const ids = sorted.map((c) => c.id);

        expect(ids[0]).toBe('shape-3'); // -5 < 10
        expect(ids[1]).toBe('shape-1');
    });
});
