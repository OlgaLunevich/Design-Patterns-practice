import { Specification } from './specification';

export class MeasureRangeSpecification<T> implements Specification<T> {
    constructor(
        private readonly measureFn: (shape: T) => number,
        private readonly min: number,
        private readonly max: number,
    ) {}

    isSatisfiedBy(candidate: T): boolean {
        const value = this.measureFn(candidate);

        if (!Number.isFinite(value)) {
            return false;
        }

        return value >= this.min && value <= this.max;
    }
}
