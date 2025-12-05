import { Shape } from '../shapes/shape';
import { Specification } from '../specifications/specification';
import { Comparator } from '../comparators/comparator';
import { ShapeObserver } from '../observer/shape-observer';

export interface ShapeRepository<T extends Shape> {
    add(shape: T): void;
    addMany(shapes: T[]): void;
    removeById(id: string): boolean;
    update(shape: T): void;
    getById(id: string): T | null;
    getAll(): T[];
    clear(): void;
    findBySpecification(specification: Specification<T>): T[];
    sort(comparator: Comparator<T>): T[];

    addObserver(observer: ShapeObserver): void;
    removeObserver(observer: ShapeObserver): void;
}
