import { InMemoryShapeRepository } from '../src/infrastructure/repositories/in-memory-shape-repository';
import { Shape } from '../src/domain/shapes/shape';
import { Oval } from '../src/domain/entities/oval';
import { Cone } from '../src/domain/entities/cone';
import { Point } from '../src/domain/entities/point';
import {ShapeWarehouse} from "../src/domain/warehouse/shape-warehouse";

describe('ShapeWarehouse (Singleton + Observer)', () => {
    let repository: InMemoryShapeRepository<Shape>;
    let warehouse: ShapeWarehouse;

    beforeEach(() => {
        repository = new InMemoryShapeRepository<Shape>();

        warehouse = ShapeWarehouse.getInstance();
        warehouse.clear(); // чистим метрики перед каждым тестом

        repository.addObserver(warehouse);
    });

    it('stores metrics when shapes are added to the repository', () => {
        const oval = new Oval(
            'oval-1',
            new Point(-2, -1),
            new Point(2, 1),
        );

        const cone = new Cone(
            'cone-1',
            new Point(0, 0, 0),
            2,
            3,
        );

        repository.add(oval);
        repository.add(cone);

        const ovalMetrics = warehouse.getMetrics('oval-1');
        const coneMetrics = warehouse.getMetrics('cone-1');

        expect(ovalMetrics).not.toBeNull();
        expect(ovalMetrics?.area).toBeDefined();
        expect(ovalMetrics?.perimeter).toBeDefined();
        expect(ovalMetrics?.area).toBeGreaterThan(0);
        expect(ovalMetrics?.perimeter).toBeGreaterThan(0);

        expect(coneMetrics).not.toBeNull();
        expect(coneMetrics?.volume).toBeDefined();
        expect(coneMetrics?.surfaceArea).toBeDefined();
        expect(coneMetrics?.volume).toBeGreaterThan(0);
        expect(coneMetrics?.surfaceArea).toBeGreaterThan(0);
    });

    it('recalculates metrics when shape is updated in the repository', () => {
        const oval = new Oval(
            'oval-2',
            new Point(-2, -1),
            new Point(2, 1),
        );

        repository.add(oval);

        const areaBefore = warehouse.getArea('oval-2');
        expect(areaBefore).toBeDefined();

        // создаём новый Oval с тем же id, но большими размерами
        const updatedOval = new Oval(
            'oval-2', // тот же id!
            new Point(-4, -2),
            new Point(4, 2),
        );

        repository.update(updatedOval);

        const areaAfter = warehouse.getArea('oval-2');
        expect(areaAfter).toBeDefined();
        // площадь должна увеличиться
        expect(areaAfter as number).toBeGreaterThan(areaBefore as number);
        expect(areaAfter).not.toBe(areaBefore);
    });

    it('removes metrics when shape is removed from the repository', () => {
        const cone = new Cone(
            'cone-2',
            new Point(0, 0, 0),
            1,
            3,
        );

        repository.add(cone);

        const metricsBefore = warehouse.getMetrics('cone-2');
        expect(metricsBefore).not.toBeNull();

        const removed = repository.removeById('cone-2');
        expect(removed).toBe(true);

        const metricsAfter = warehouse.getMetrics('cone-2');
        expect(metricsAfter).toBeNull();
    });
});
