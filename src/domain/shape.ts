export enum ShapeType {
    OVAL = 'OVAL',
    CONE = 'CONE',
}

export interface Shape {
    readonly id: string;
    readonly type: ShapeType;
}
