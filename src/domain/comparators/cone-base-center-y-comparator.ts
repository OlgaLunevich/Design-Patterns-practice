import { Comparator } from './comparator';
import { Cone } from '../entities/cone';

export class ConeBaseCenterYComparator implements Comparator<Cone> {
    compare(a: Cone, b: Cone): number {
        const ay = a.getBaseCenter().getY();
        const by = b.getBaseCenter().getY();

        return ay - by;
    }
}
