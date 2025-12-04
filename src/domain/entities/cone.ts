import { Shape, ShapeType } from '../shapes/shape';
import { Point } from './point';

export class Cone implements Shape {
    public readonly id: string;
    public readonly type: ShapeType = ShapeType.CONE;
    private readonly baseCenter: Point;
    private readonly radius: number;
    private readonly height: number;

    constructor(id: string, baseCenter: Point, radius: number, height: number) {
        this.id = id;
        this.baseCenter = baseCenter;
        this.radius = radius;
        this.height = height;
    }

    getBaseCenter(): Point {
        return this.baseCenter;
    }

    getRadius(): number {
        return this.radius;
    }

    getHeight(): number {
        return this.height;
    }
}
