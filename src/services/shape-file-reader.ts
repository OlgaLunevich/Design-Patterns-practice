import fs from 'fs';
import path from 'path';
import { Shape } from '../domain/shape';
import { ShapeFactory } from '../factories/shape-factory';
import { logger } from '../logger/logger';
import { FileError } from '../errors/file-error';

export class ShapeFileReaderService {
    readShapesFromFile<T extends Shape>(
        relativeFilePath: string,
        factory: ShapeFactory<T>,
    ): T[] {
        const absolutePath = path.resolve(relativeFilePath);

        let content: string;
        try {
            content = fs.readFileSync(absolutePath, { encoding: 'utf-8' });
        } catch (error) {
            logger.error({ error, absolutePath }, 'Failed to read shapes file');
            throw new FileError(`Failed to read file: ${absolutePath}`);
        }

        const lines = content.split(/\r?\n/);
        const shapes: T[] = [];

        lines.forEach((rawLine, index) => {
            const line = rawLine.trim();

            if (!line) {
                return;
            }

            const id = `shape-${index + 1}`;
            const shape = factory.createFromLine(id, line);

            if (shape) {
                shapes.push(shape);
            } else {
                logger.info(
                    { id, lineNumber: index + 1 },
                    'Skipped invalid line while reading shapes file',
                );
            }
        });

        logger.info(
            { absolutePath, count: shapes.length },
            'Successfully read shapes from file',
        );

        return shapes;
    }
}
