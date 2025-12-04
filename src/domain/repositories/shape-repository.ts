import { Shape } from '../shapes/shape';
import { Specification } from '../specifications/specification';

export interface ShapeRepository<T extends Shape> {
    add(shape: T): void;
    addMany(shapes: T[]): void;
    removeById(id: string): boolean;
    getById(id: string): T | null;
    getAll(): T[];
    clear(): void;
    findBySpecification(specification: Specification<T>): T[];
}
