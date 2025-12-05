import { InMemoryShapeRepository } from '../src/infrastructure/repositories/in-memory-shape-repository';
import { Shape } from '../src/domain/shapes/shape';
import { Oval } from '../src/domain/entities/oval';
import { Cone } from '../src/domain/entities/cone';
import { Point } from '../src/domain/entities/point';
import { ShapeIdComparator } from '../src/domain/comparators/shape-id-comparator';
import { ShapeTypeSpecification } from '../src/domain/specifications/shape-type-specification';
import { ShapeType } from '../src/domain/shapes/shape';

describe('InMemoryShapeRepository', () => {
    let repo: InMemoryShapeRepository<Shape>;
    let oval: Oval;
    let cone: Cone;

    beforeEach(() => {
        repo = new InMemoryShapeRepository<Shape>();

        oval = new Oval('id-oval', new Point(0, 0), new Point(2, 2));
        cone = new Cone('id-cone', new Point(0, 0, 0), 2, 3);

        repo.add(oval);
        repo.add(cone);
    });

    it('adds and retrieves shapes', () => {
        const all = repo.getAll();

        expect(all.length).toBe(2);
        expect(repo.getById('id-oval')).toBe(oval);
        expect(repo.getById('id-cone')).toBe(cone);
    });

    it('updates shapes', () => {
        const updatedOval = new Oval('id-oval', new Point(0, 0), new Point(10, 10));

        repo.update(updatedOval);

        const stored = repo.getById('id-oval');
        expect(stored).toBe(updatedOval);
        expect(stored).not.toBe(oval);
    });

    it('removes shapes', () => {
        const removed = repo.removeById('id-oval');

        expect(removed).toBe(true);
        expect(repo.getById('id-oval')).toBeNull();
        expect(repo.getAll().length).toBe(1);
    });

    it('finds shapes by specification', () => {
        const spec = new ShapeTypeSpecification<Shape>(ShapeType.OVAL);
        const result = repo.findBySpecification(spec);

        expect(result.length).toBe(1);
        expect(result[0].id).toBe('id-oval');
    });

    it('sorts shapes using comparator', () => {
        const sorted = repo.sort(new ShapeIdComparator());

        expect(sorted.map(s => s.id)).toEqual(['id-cone', 'id-oval']);
    });
});
