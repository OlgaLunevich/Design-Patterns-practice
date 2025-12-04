import { Specification } from './specification';
import { PointSelector } from './point-selector';

export class DistanceRangeSpecification<T> implements Specification<T> {
    constructor(
        private readonly pointSelector: PointSelector<T>,
        private readonly minDistance: number,
        private readonly maxDistance: number,
    ) {}

    isSatisfiedBy(candidate: T): boolean {
        const point = this.pointSelector(candidate);
        const x = point.getX();
        const y = point.getY();
        const z = point.getZ() ?? 0;

        const distance = Math.sqrt(x * x + y * y + z * z);

        return distance >= this.minDistance && distance <= this.maxDistance;
    }
}
