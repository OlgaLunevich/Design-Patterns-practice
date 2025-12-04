// import { logger } from './logger/logger';
// // export const APP_NAME = 'shapes-app';
// //
// // console.log(`${APP_NAME} started`);
// // logger.info(`${APP_NAME} started`);

import * as path from 'path';

import { logger } from './infrastructure/logger/logger';
import { ShapeFileReaderService } from './infrastructure/file/shape-file-reader';
import { OvalFactory } from './application/factories/oval-factory';
import { ConeFactory } from './application/factories/cone-factory';

export const APP_NAME = 'shapes-app';

const reader = new ShapeFileReaderService();
const ovalFactory = new OvalFactory();
const coneFactory = new ConeFactory();

try {
    const ovalsFilePath = path.join('data', 'ovals.txt');
    const conesFilePath = path.join('data', 'cones.txt');

    const ovals = reader.readShapesFromFile(ovalsFilePath, ovalFactory);
    const cones = reader.readShapesFromFile(conesFilePath, coneFactory);

    logger.info(
        { ovalsCount: ovals.length, conesCount: cones.length },
        `${APP_NAME} started and shapes loaded`,
    );
} catch (error) {
    logger.error({ error }, 'Failed to initialize shapes');
}
