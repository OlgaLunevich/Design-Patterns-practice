import { Shape, ShapeType } from '../../domain/shapes/shape';
import { ShapeRepository } from '../../domain/repositories/shape-repository';
import { Oval } from '../../domain/entities/oval';
import { Cone } from '../../domain/entities/cone';
import { Point } from '../../domain/entities/point';

import { OvalGeometryService } from './oval-geometry-service';
import { ConeGeometryService } from './cone-geometry-service';

import { ShapeIdSpecification } from '../../domain/specifications/shape-id-specification';
import { ShapeTypeSpecification } from '../../domain/specifications/shape-type-specification';
import { FirstQuadrantSpecification } from '../../domain/specifications/first-quadrant-specification';
import { DistanceRangeSpecification } from '../../domain/specifications/distance-range-specification';
import { MeasureRangeSpecification } from '../../domain/specifications/measure-range-specification';

export class ShapeSearchService {
    constructor(
        private readonly repository: ShapeRepository<Shape>,
        private readonly ovalGeometryService: OvalGeometryService,
        private readonly coneGeometryService: ConeGeometryService,
    ) {}

    // ---------- ПОИСК ПО ID / ТИПУ ----------

    //
    //  Найти единственную фигуру по ID (через Specification).
    //
    findShapeById(id: string): Shape | null {
        const spec = new ShapeIdSpecification<Shape>(id);
        const result = this.repository.findBySpecification(spec);
        return result.length > 0 ? result[0] : null;
    }

    //
    //  Найти все фигуры указанного типа (OVAL / CONE).
    //
    findShapesByType(type: ShapeType): Shape[] {
        const spec = new ShapeTypeSpecification<Shape>(type);
        return this.repository.findBySpecification(spec);
    }

    // ---------- ПОИСК ПО КООРДИНАТАМ ----------

    //
    //   Найти все овалы, чьи центры находятся в первом квадранте.
    //   Центр овала — середина описанного прямоугольника.
    //
    findOvalsInFirstQuadrant(): Oval[] {
        const typeSpec = new ShapeTypeSpecification<Shape>(ShapeType.OVAL);
        const allOvals = this.repository.findBySpecification(typeSpec) as Oval[];

        const firstQuadrantSpec = new FirstQuadrantSpecification<Oval>((oval) => {
            const first = oval.getFirstCorner();
            const second = oval.getSecondCorner();

            const centerX = (first.getX() + second.getX()) / 2;
            const centerY = (first.getY() + second.getY()) / 2;

            return new Point(centerX, centerY);
        });

        return allOvals.filter((oval) => firstQuadrantSpec.isSatisfiedBy(oval));
    }

    //
    //   Найти все конусы, основание которых находится в первом квадранте.
    //   Используем центр основания конуса.
    //
    findConesInFirstQuadrant(): Cone[] {
        const typeSpec = new ShapeTypeSpecification<Shape>(ShapeType.CONE);
        const allCones = this.repository.findBySpecification(typeSpec) as Cone[];

        const firstQuadrantSpec = new FirstQuadrantSpecification<Cone>(
            (cone) => cone.getBaseCenter(),
        );

        return allCones.filter((cone) => firstQuadrantSpec.isSatisfiedBy(cone));
    }

      //
      // Найти все фигуры, расстояние от “опорной” точки которых
      // до начала координат лежит в диапазоне [minDistance, maxDistance].
      //
      // Для овала — используем центр овала,
      // для конуса — центр основания.

    findShapesByDistanceRange(minDistance: number, maxDistance: number): Shape[] {
        const allShapes = this.repository.getAll();

        return allShapes.filter((shape) => {
            if (shape.type === ShapeType.OVAL) {
                const oval = shape as Oval;
                const first = oval.getFirstCorner();
                const second = oval.getSecondCorner();

                const centerX = (first.getX() + second.getX()) / 2;
                const centerY = (first.getY() + second.getY()) / 2;

                const centerPoint = new Point(centerX, centerY);
                const spec = new DistanceRangeSpecification<Oval>(
                    () => centerPoint,
                    minDistance,
                    maxDistance,
                );

                return spec.isSatisfiedBy(oval);
            }

            if (shape.type === ShapeType.CONE) {
                const cone = shape as Cone;
                const spec = new DistanceRangeSpecification<Cone>(
                    (c) => c.getBaseCenter(),
                    minDistance,
                    maxDistance,
                );

                return spec.isSatisfiedBy(cone);
            }

            return false;
        });
    }

    // ---------- ПОИСК ПО ПЛОЩАДЯМ / ОБЪЁМАМ / ПЕРИМЕТРАМ ----------

    //
    //  Найти овалы, чья площадь лежит в диапазоне [minArea, maxArea].
    //
    findOvalsByAreaRange(minArea: number, maxArea: number): Oval[] {
        const typeSpec = new ShapeTypeSpecification<Shape>(ShapeType.OVAL);
        const allOvals = this.repository.findBySpecification(typeSpec) as Oval[];

        const areaSpec = new MeasureRangeSpecification<Oval>(
            (oval) => this.ovalGeometryService.getArea(oval),
            minArea,
            maxArea,
        );

        return allOvals.filter((oval) => areaSpec.isSatisfiedBy(oval));
    }

    //
    //  Найти овалы, чей периметр (приближённый) лежит в диапазоне [minPerimeter, maxPerimeter].
    //
    findOvalsByPerimeterRange(minPerimeter: number, maxPerimeter: number): Oval[] {
        const typeSpec = new ShapeTypeSpecification<Shape>(ShapeType.OVAL);
        const allOvals = this.repository.findBySpecification(typeSpec) as Oval[];

        const perimeterSpec = new MeasureRangeSpecification<Oval>(
            (oval) => this.ovalGeometryService.getPerimeterApprox(oval),
            minPerimeter,
            maxPerimeter,
        );

        return allOvals.filter((oval) => perimeterSpec.isSatisfiedBy(oval));
    }

    //
    //  Найти конусы, объём которых лежит в диапазоне [minVolume, maxVolume].
    //
    findConesByVolumeRange(minVolume: number, maxVolume: number): Cone[] {
        const typeSpec = new ShapeTypeSpecification<Shape>(ShapeType.CONE);
        const allCones = this.repository.findBySpecification(typeSpec) as Cone[];

        const volumeSpec = new MeasureRangeSpecification<Cone>(
            (cone) => this.coneGeometryService.getVolume(cone),
            minVolume,
            maxVolume,
        );

        return allCones.filter((cone) => volumeSpec.isSatisfiedBy(cone));
    }

    //
    //  Найти конусы, площадь поверхности которых лежит в диапазоне [minArea, maxArea].
    //
    findConesBySurfaceAreaRange(minArea: number, maxArea: number): Cone[] {
        const typeSpec = new ShapeTypeSpecification<Shape>(ShapeType.CONE);
        const allCones = this.repository.findBySpecification(typeSpec) as Cone[];

        const areaSpec = new MeasureRangeSpecification<Cone>(
            (cone) => this.coneGeometryService.getSurfaceArea(cone),
            minArea,
            maxArea,
        );

        return allCones.filter((cone) => areaSpec.isSatisfiedBy(cone));
    }
}
