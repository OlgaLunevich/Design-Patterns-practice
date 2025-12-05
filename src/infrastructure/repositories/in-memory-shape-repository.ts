import { Shape } from '../../domain/shapes/shape';
import { ShapeRepository } from '../../domain/repositories/shape-repository';
import { Specification } from '../../domain/specifications/specification';
import { Comparator } from '../../domain/comparators/comparator';
import { ShapeObserver } from '../../domain/observer/shape-observer';
import { ShapeChangeType } from '../../domain/observer/shape-change-type';

export class InMemoryShapeRepository<T extends Shape> implements ShapeRepository<T> {
    private readonly items: Map<string, T>;

    private readonly observers: ShapeObserver[] = [];

    constructor(initialItems: T[] = []) {
        this.items = new Map<string, T>();
        initialItems.forEach((item) => {
            this.items.set(item.id, item);
        });
    }

    private notifyObservers(shape: T, changeType: ShapeChangeType): void {
        this.observers.forEach((observer) => {
            observer.onShapeChanged(shape, changeType);
        });
    }

    addObserver(observer: ShapeObserver): void {
        this.observers.push(observer);
    }

    removeObserver(observer: ShapeObserver): void {
        const index = this.observers.indexOf(observer);
        if (index !== -1) {
            this.observers.splice(index, 1);
        }
    }

    add(shape: T): void {
        this.items.set(shape.id, shape);
        this.notifyObservers(shape, ShapeChangeType.ADDED);
    }

    addMany(shapes: T[]): void {
        shapes.forEach((shape) => this.add(shape));
    }

    update(shape: T): void {
        this.items.set(shape.id, shape);
        this.notifyObservers(shape, ShapeChangeType.UPDATED);
    }

    removeById(id: string): boolean {
        const existing = this.items.get(id);
        if (!existing) {
            return false;
        }

        const removed = this.items.delete(id);

        if (removed) {
            this.notifyObservers(existing, ShapeChangeType.REMOVED);
        }

        return removed;
    }

    getById(id: string): T | null {
        return this.items.get(id) ?? null;
    }

    getAll(): T[] {
        return Array.from(this.items.values());
    }

    clear(): void {
        const all = this.getAll();
        this.items.clear();
        all.forEach((shape) => {
            this.notifyObservers(shape, ShapeChangeType.REMOVED);
        });
    }

    findBySpecification(specification: Specification<T>): T[] {
        return this.getAll().filter((item) => specification.isSatisfiedBy(item));
    }

    sort(comparator: Comparator<T>): T[] {
        const items = this.getAll();
        return items.sort((a, b) => comparator.compare(a, b));
    }
}