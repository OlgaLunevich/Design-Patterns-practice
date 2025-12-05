import { Shape, ShapeType } from '../shapes/shape';
import { ShapeObserver } from '../observer/shape-observer';
import { ShapeChangeType } from '../observer/shape-change-type';
import { ShapeMetrics } from './shape-metrics';
import { Oval } from '../entities/oval';
import { Cone } from '../entities/cone';
import {OvalGeometryService} from "../../application/services/oval-geometry-service";
import {ConeGeometryService} from "../../application/services/cone-geometry-service";

import { logger } from '../../infrastructure/logger/logger';

export class ShapeWarehouse implements ShapeObserver {
    private static instance: ShapeWarehouse | null = null;

    private readonly metrics: Map<string, ShapeMetrics> = new Map();

    private readonly ovalGeometryService: OvalGeometryService;

    private readonly coneGeometryService: ConeGeometryService;

    private constructor() {
        this.ovalGeometryService = new OvalGeometryService();
        this.coneGeometryService = new ConeGeometryService();
    }

    public static getInstance(): ShapeWarehouse {
        if (!ShapeWarehouse.instance) {
            ShapeWarehouse.instance = new ShapeWarehouse();
        }
        return ShapeWarehouse.instance;
    }

    onShapeChanged(shape: Shape, changeType: ShapeChangeType): void {
        if (changeType === ShapeChangeType.REMOVED) {
            this.metrics.delete(shape.id);
            logger.info({ shapeId: shape.id }, 'Removed metrics from warehouse');
            return;
        }

        const metrics: ShapeMetrics = {};

        if (shape.type === ShapeType.OVAL) {
            const oval = shape as Oval;
            metrics.area = this.ovalGeometryService.getArea(oval);
            metrics.perimeter = this.ovalGeometryService.getPerimeterApprox(oval);
        }

        if (shape.type === ShapeType.CONE) {
            const cone = shape as Cone;
            metrics.volume = this.coneGeometryService.getVolume(cone);
            metrics.surfaceArea = this.coneGeometryService.getSurfaceArea(cone);
        }

        this.metrics.set(shape.id, metrics);

        logger.info(
            { shapeId: shape.id, changeType, metrics },
            'Updated warehouse metrics for shape',
        );
    }

    getMetrics(shapeId: string): ShapeMetrics | null {
        return this.metrics.get(shapeId) ?? null;
    }

    getArea(shapeId: string): number | undefined {
        return this.metrics.get(shapeId)?.area;
    }

    getPerimeter(shapeId: string): number | undefined {
        return this.metrics.get(shapeId)?.perimeter;
    }

    getVolume(shapeId: string): number | undefined {
        return this.metrics.get(shapeId)?.volume;
    }

    getSurfaceArea(shapeId: string): number | undefined {
        return this.metrics.get(shapeId)?.surfaceArea;
    }

    clear(): void {
        this.metrics.clear();
    }
}
