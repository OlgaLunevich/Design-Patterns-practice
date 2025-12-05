import { Shape } from '../shapes/shape';
import { ShapeChangeType } from './shape-change-type';

export interface ShapeObserver {
    onShapeChanged(shape: Shape, changeType: ShapeChangeType): void;
}
