import { Shape, ShapeType } from './shape';
import { Point } from './point';

export class Oval implements Shape {
    public readonly id: string;
    public readonly type: ShapeType = ShapeType.OVAL;
    private readonly firstCorner: Point;
    private readonly secondCorner: Point;

    constructor(id: string, firstCorner: Point, secondCorner: Point) {
        this.id = id;
        this.firstCorner = firstCorner;
        this.secondCorner = secondCorner;
    }

    getFirstCorner(): Point {
        return this.firstCorner;
    }

    getSecondCorner(): Point {
        return this.secondCorner;
    }
}
