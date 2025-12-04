import { Specification } from './specification';
import { Shape } from '../shapes/shape';

export class ShapeIdSpecification<T extends Shape> implements Specification<T> {
    constructor(private readonly id: string) {}

    isSatisfiedBy(candidate: T): boolean {
        return candidate.id === this.id;
    }
}
