import { Comparator } from './comparator';
import { Oval } from '../entities/oval';

export class OvalFirstPointYComparator implements Comparator<Oval> {
    compare(a: Oval, b: Oval): number {
        const ay = a.getFirstCorner().getY();
        const by = b.getFirstCorner().getY();

        return ay - by;
    }
}
