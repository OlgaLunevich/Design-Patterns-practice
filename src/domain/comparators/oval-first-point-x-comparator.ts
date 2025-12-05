import { Comparator } from './comparator';
import { Oval } from '../entities/oval';

export class OvalFirstPointXComparator implements Comparator<Oval> {
    compare(a: Oval, b: Oval): number {
        const ax = a.getFirstCorner().getX();
        const bx = b.getFirstCorner().getX();

        return ax - bx;
    }
}
