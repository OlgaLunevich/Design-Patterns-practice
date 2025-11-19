import * as path from 'path';


import { ShapeFileReaderService } from '../src/services/shape-file-reader';
import { OvalFactory } from '../src/factories/oval-factory';
import { ConeFactory } from '../src/factories/cone-factory';
import { OvalInputValidator } from '../src/validation/oval-input-validator';
import { ConeInputValidator } from '../src/validation/cone-input-validator';
import { Oval } from '../src/domain/oval';
import { Cone } from '../src/domain/cone';

describe('ShapeFileReaderService', () => {
    const reader = new ShapeFileReaderService();

    it('reads only valid ovals from file', () => {
        const filePath = path.join('tests', 'data', 'ovals-test.txt');
        const factory = new OvalFactory(new OvalInputValidator());

        const ovals = reader.readShapesFromFile(filePath, factory);

        expect(Array.isArray(ovals)).toBe(true);
        expect(ovals.length).toBeGreaterThan(0);
        expect(ovals.every((o) => o instanceof Oval)).toBe(true);
    });

    it('reads only valid cones from file', () => {
        const filePath = path.join('tests', 'data', 'cones-test.txt');
        const factory = new ConeFactory(new ConeInputValidator());

        const cones = reader.readShapesFromFile(filePath, factory);

        expect(Array.isArray(cones)).toBe(true);
        expect(cones.length).toBeGreaterThan(0);
        expect(cones.every((c) => c instanceof Cone)).toBe(true);
    });

    it('throws FileError when file does not exist', () => {
        const filePath = path.join('tests', 'data', 'no-such-file.txt');
        const factory = new OvalFactory(new OvalInputValidator());

        let caughtError: unknown;

        try {
            reader.readShapesFromFile(filePath, factory);
        } catch (error) {
            caughtError = error;
        }

        expect(caughtError).toBeDefined();
        expect((caughtError as Error).name).toBe('FileError');
    });
});
