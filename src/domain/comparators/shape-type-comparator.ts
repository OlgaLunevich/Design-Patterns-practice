import { Comparator } from './comparator';
import { Shape } from '../shapes/shape';

export class ShapeTypeComparator<T extends Shape> implements Comparator<T> {
    compare(a: T, b: T): number {
        if (a.type < b.type) return -1;
        if (a.type > b.type) return 1;
        return 0;
    }
}
