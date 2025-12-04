import { Point } from '../entities/point';

export type PointSelector<T> = (shape: T) => Point;
