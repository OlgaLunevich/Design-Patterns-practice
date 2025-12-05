import { Comparator } from './comparator';
import { Cone } from '../entities/cone';

export class ConeBaseCenterXComparator implements Comparator<Cone> {
    compare(a: Cone, b: Cone): number {
        const ax = a.getBaseCenter().getX();
        const bx = b.getBaseCenter().getX();

        return ax - bx;
    }
}
