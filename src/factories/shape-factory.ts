import { Shape } from '../domain/shape';

export interface ShapeFactory<T extends Shape> {
    createFromLine(id: string, line: string): T | null;
}
