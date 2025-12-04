import { ConeFactory } from '../src/application/factories/cone-factory';
import { ConeInputValidator } from '../src/shared/validation/cone-input-validator';
import { Cone } from '../src/domain/entities/cone';

describe('ConeFactory', () => {
    const factory = new ConeFactory(new ConeInputValidator());

    it('creates Cone from valid line', () => {
        const line = '0 0 0 3 5';
        const id = 'cone-1';

        const cone = factory.createFromLine(id, line);

        expect(cone).toBeInstanceOf(Cone);
        expect(cone?.id).toBe(id);
        expect(cone?.getRadius()).toBe(3);
        expect(cone?.getHeight()).toBe(5);

        const center = cone?.getBaseCenter();
        expect(center?.getX()).toBe(0);
        expect(center?.getY()).toBe(0);
        expect(center?.getZ()).toBe(0);
    });

    it('returns null for non numeric value', () => {
        const line = '1 2 z 4 5';
        const id = 'cone-2';

        const cone = factory.createFromLine(id, line);

        expect(cone).toBeNull();
    });

    it('returns null for negative radius or height', () => {
        const line = '1 2 3 -1 5';
        const id = 'cone-3';

        const cone = factory.createFromLine(id, line);

        expect(cone).toBeNull();
    });

    it('returns null for line with too few values', () => {
        const line = '1 2 3 4';
        const id = 'cone-4';

        const cone = factory.createFromLine(id, line);

        expect(cone).toBeNull();
    });

    it('returns null for empty line', () => {
        const line = '   ';
        const id = 'cone-5';

        const cone = factory.createFromLine(id, line);

        expect(cone).toBeNull();
    });
});
