import { Shape } from '../../domain/shapes/shape';
import { ShapeRepository } from '../../domain/repositories/shape-repository';
import { Specification } from '../../domain/specifications/specification';

export class InMemoryShapeRepository<T extends Shape> implements ShapeRepository<T> {
    private readonly items: Map<string, T>;

    constructor(initialItems: T[] = []) {
        this.items = new Map<string, T>();

        initialItems.forEach((item) => {
            this.items.set(item.id, item);
        });
    }

    add(shape: T): void {
        this.items.set(shape.id, shape);
    }

    addMany(shapes: T[]): void {
        shapes.forEach((shape) => this.add(shape));
    }

    removeById(id: string): boolean {
        return this.items.delete(id);
    }

    getById(id: string): T | null {
        return this.items.get(id) ?? null;
    }

    getAll(): T[] {
        return Array.from(this.items.values());
    }

    clear(): void {
        this.items.clear();
    }

    findBySpecification(specification: Specification<T>): T[] {
        return this.getAll().filter((item) => specification.isSatisfiedBy(item));
    }
}
