import { Specification } from './specification';
import { PointSelector } from './point-selector';

export class FirstQuadrantSpecification<T> implements Specification<T> {
    constructor(private readonly pointSelector: PointSelector<T>) {}

    isSatisfiedBy(candidate: T): boolean {
        const point = this.pointSelector(candidate);
        return point.getX() > 0 && point.getY() > 0;
    }
}
