import { Comparator } from './comparator';
import { Shape } from '../shapes/shape';

export class ShapeIdComparator<T extends Shape> implements Comparator<T> {
    compare(a: T, b: T): number {
        if (a.id < b.id) return -1;
        if (a.id > b.id) return 1;
        return 0;
    }
}
