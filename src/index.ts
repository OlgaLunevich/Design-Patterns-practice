import * as path from 'path';

import { logger } from './infrastructure/logger/logger';
import { ShapeFileReaderService } from './infrastructure/file/shape-file-reader';
import { OvalFactory } from './application/factories/oval-factory';
import { ConeFactory } from './application/factories/cone-factory';
import { InMemoryShapeRepository } from './infrastructure/repositories/in-memory-shape-repository';
import { Shape } from './domain/shapes/shape';
import {ShapeWarehouse} from "./domain/warehouse/shape-warehouse";

export const APP_NAME = 'shapes-app';

const reader = new ShapeFileReaderService();
const ovalFactory = new OvalFactory();
const coneFactory = new ConeFactory();

const shapeRepository = new InMemoryShapeRepository<Shape>();
const warehouse = ShapeWarehouse.getInstance();
shapeRepository.addObserver(warehouse);

try {
    const ovalsFilePath = path.join('data', 'ovals.txt');
    const conesFilePath = path.join('data', 'cones.txt');

    const ovals = reader.readShapesFromFile(ovalsFilePath, ovalFactory);
    const cones = reader.readShapesFromFile(conesFilePath, coneFactory);

    shapeRepository.addMany(ovals);
    shapeRepository.addMany(cones);

    logger.info(
        {
            ovalsCount: ovals.length,
            conesCount: cones.length,
            totalShapes: shapeRepository.getAll().length,
        },
        `${APP_NAME} started, shapes loaded into repository and warehouse`,
    );
} catch (error) {
    logger.error({ error }, 'Failed to initialize shapes');
}
