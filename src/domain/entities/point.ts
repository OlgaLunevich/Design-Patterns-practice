export class Point {
    private readonly x: number;
    private readonly y: number;
    private readonly z?: number;

    constructor(x: number, y: number, z?: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    getX(): number {
        return this.x;
    }

    getY(): number {
        return this.y;
    }

    getZ(): number | undefined {
        return this.z;
    }
}

