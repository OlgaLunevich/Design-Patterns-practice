import { Specification } from './specification';
import { Shape, ShapeType } from '../shapes/shape';

export class ShapeTypeSpecification<T extends Shape> implements Specification<T> {
    constructor(private readonly type: ShapeType) {}

    isSatisfiedBy(candidate: T): boolean {
        return candidate.type === this.type;
    }
}
