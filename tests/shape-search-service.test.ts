import { InMemoryShapeRepository } from '../src/infrastructure/repositories/in-memory-shape-repository';
import { Shape, ShapeType } from '../src/domain/shapes/shape';
import { ShapeSearchService } from '../src/application/services/shape-search-service';
import { Oval } from '../src/domain/entities/oval';
import { Cone } from '../src/domain/entities/cone';
import { Point } from '../src/domain/entities/point';
import { OvalGeometryService } from '../src/application/services/oval-geometry-service';
import { ConeGeometryService } from '../src/application/services/cone-geometry-service';

describe('ShapeSearchService', () => {
    let repository: InMemoryShapeRepository<Shape>;
    let ovalGeometryService: OvalGeometryService;
    let coneGeometryService: ConeGeometryService;
    let searchService: ShapeSearchService;

    let ovalSmall: Oval;
    let ovalLarge: Oval;
    let coneSmall: Cone;
    let coneLarge: Cone;
    let coneFirstQuadrant: Cone;
    let ovalFirstQuadrant: Oval;

    beforeEach(() => {
        repository = new InMemoryShapeRepository<Shape>();
        ovalGeometryService = new OvalGeometryService();
        coneGeometryService = new ConeGeometryService();
        searchService = new ShapeSearchService(repository, ovalGeometryService, coneGeometryService);

        // Овал с небольшой площадью: corners (-2, -1) и (2, 1)
        // a = 2, b = 1, area = 2π ≈ 6.28
        ovalSmall = new Oval(
            'oval-small',
            new Point(-2, -1),
            new Point(2, 1),
        );

        // Овал с большой площадью: corners (-4, -2) и (4, 2)
        // a = 4, b = 2, area = 8π ≈ 25.13
        ovalLarge = new Oval(
            'oval-large',
            new Point(-4, -2),
            new Point(4, 2),
        );

        // Овал с центром в первом квадранте: corners (0, 0) и (2, 2) → центр (1, 1)
        ovalFirstQuadrant = new Oval(
            'oval-first-quadrant',
            new Point(0, 0),
            new Point(2, 2),
        );

        // Конус с маленьким объёмом: r = 1, h = 3 → V = π ≈ 3.14
        coneSmall = new Cone(
            'cone-small',
            new Point(0, 0, 0),
            1,
            3,
        );

        // Конус с большим объёмом: r = 2, h = 3 → V = 4π ≈ 12.57
        coneLarge = new Cone(
            'cone-large',
            new Point(0, 0, 0),
            2,
            3,
        );

        // Конус, основание в первом квадранте: baseCenter (2, 2, 0)
        coneFirstQuadrant = new Cone(
            'cone-first-quadrant',
            new Point(2, 2, 0),
            1,
            1,
        );

        repository.addMany([
            ovalSmall,
            ovalLarge,
            ovalFirstQuadrant,
            coneSmall,
            coneLarge,
            coneFirstQuadrant,
        ]);
    });

    it('finds shape by id using specification', () => {
        const found = searchService.findShapeById('oval-small');
        const notFound = searchService.findShapeById('no-such-id');

        expect(found).not.toBeNull();
        expect(found?.id).toBe('oval-small');
        expect(found?.type).toBe(ShapeType.OVAL);

        expect(notFound).toBeNull();
    });

    it('finds shapes by type (OVAL / CONE)', () => {
        const ovals = searchService.findShapesByType(ShapeType.OVAL);
        const cones = searchService.findShapesByType(ShapeType.CONE);

        const ovalIds = ovals.map((o) => o.id);
        const coneIds = cones.map((c) => c.id);

        expect(ovalIds).toEqual(
            expect.arrayContaining(['oval-small', 'oval-large', 'oval-first-quadrant']),
        );
        expect(coneIds).toEqual(
            expect.arrayContaining(['cone-small', 'cone-large', 'cone-first-quadrant']),
        );

        expect(ovals.length).toBe(3);
        expect(cones.length).toBe(3);
    });

    it('finds ovals whose centers are in the first quadrant', () => {
        const result = searchService.findOvalsInFirstQuadrant();
        const ids = result.map((o) => o.id);

        expect(ids).toContain('oval-first-quadrant');
        expect(ids).not.toContain('oval-small'); // его центр в (0,0)
        expect(ids).not.toContain('oval-large');

        expect(result.length).toBe(1);
    });

    it('finds cones whose base center is in the first quadrant', () => {
        const result = searchService.findConesInFirstQuadrant();
        const ids = result.map((c) => c.id);

        expect(ids).toContain('cone-first-quadrant');
        expect(ids).not.toContain('cone-small');
        expect(ids).not.toContain('cone-large');

        expect(result.length).toBe(1);
    });

    it('finds shapes by distance range from origin', () => {
        // Расстояние центра:
        // - oval-first-quadrant: центр (1,1) → расстояние ~1.41
        // - cone-first-quadrant: (2,2,0) → расстояние ~2.83
        // Остальные фигуры имеют центры в (0,0,0)

        const nearShapes = searchService.findShapesByDistanceRange(0, 2); // захватываем (~1.41)
        const farShapes = searchService.findShapesByDistanceRange(2.5, 3.5); // захватываем (~2.83)

        const nearIds = nearShapes.map((s) => s.id);
        const farIds = farShapes.map((s) => s.id);

        expect(nearIds).toEqual(
            expect.arrayContaining(['oval-small', 'oval-large', 'oval-first-quadrant', 'cone-small', 'cone-large']),
        );
        expect(nearIds).not.toContain('cone-first-quadrant');

        expect(farIds).toContain('cone-first-quadrant');
        expect(farIds).not.toContain('oval-first-quadrant');

        expect(nearShapes.length).toBeGreaterThan(0);
        expect(farShapes.length).toBe(1);
    });

    it('finds ovals by area range', () => {
        // Площадь:
        // - oval-small: 2π ≈ 6.28
        // - oval-large: 8π ≈ 25.13

        const smallAreaOvals = searchService.findOvalsByAreaRange(5, 10);
        const largeAreaOvals = searchService.findOvalsByAreaRange(20, 30);

        const smallIds = smallAreaOvals.map((o) => o.id);
        const largeIds = largeAreaOvals.map((o) => o.id);

        expect(smallIds).toContain('oval-small');
        expect(smallIds).not.toContain('oval-large');

        expect(largeIds).toContain('oval-large');
        expect(largeIds).not.toContain('oval-small');

        expect(smallAreaOvals.length).toBe(1);
        expect(largeAreaOvals.length).toBe(1);
    });

    it('finds ovals by perimeter range', () => {
        // Периметр oval-small меньше, чем у oval-large,
        // поэтому можем проверить, что диапазоны разделяют их.
        const smallPerimeterOvals = searchService.findOvalsByPerimeterRange(5, 15);
        const largePerimeterOvals = searchService.findOvalsByPerimeterRange(15, 100);

        const smallPerimeterIds = smallPerimeterOvals.map((o) => o.id);
        const largePerimeterIds = largePerimeterOvals.map((o) => o.id);

        expect(smallPerimeterIds).toContain('oval-small');
        expect(largePerimeterIds).toContain('oval-large');

        // не обязательно, чтобы множества были взаимоисключающими,
        // но для простоты теста считаем, что они разделяют два овала
        expect(smallPerimeterIds).not.toContain('oval-large');
        expect(largePerimeterIds).not.toContain('oval-small');
    });

    it('finds cones by volume range', () => {
        // Объём:
        // - cone-small: π ≈ 3.14
        // - cone-large: 4π ≈ 12.57

        const smallVolumeCones = searchService.findConesByVolumeRange(2, 5);
        const largeVolumeCones = searchService.findConesByVolumeRange(10, 15);

        const smallIds = smallVolumeCones.map((c) => c.id);
        const largeIds = largeVolumeCones.map((c) => c.id);

        expect(smallIds).toContain('cone-small');
        expect(smallIds).not.toContain('cone-large');

        expect(largeIds).toContain('cone-large');
        expect(largeIds).not.toContain('cone-small');

        expect(smallVolumeCones.length).toBe(1);
        expect(largeVolumeCones.length).toBe(1);
    });


    it('finds cones by surface area range', () => {
        // Площадь поверхности cone-large > cone-small,
        // поэтому диапазоны должны разделять их.
        const smallAreaCones = searchService.findConesBySurfaceAreaRange(0, 30);
        const largeAreaCones = searchService.findConesBySurfaceAreaRange(30, 200);

        const smallIds = smallAreaCones.map((c) => c.id);
        const largeIds = largeAreaCones.map((c) => c.id);

        expect(smallIds).toContain('cone-small');
        expect(largeIds).toContain('cone-large');

        expect(smallIds).not.toContain('cone-large');
        expect(largeIds).not.toContain('cone-small');
    });


});
