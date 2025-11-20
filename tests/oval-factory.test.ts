import { OvalFactory } from '../src/application/factories/oval-factory';
import { OvalInputValidator } from '../src/shared/validation/oval-input-validator';
import { Oval } from '../src/domain/entities/oval';

describe('OvalFactory', () => {
    const factory = new OvalFactory(new OvalInputValidator());

    it('creates Oval from valid line', () => {
        const line = '-2 -1 2 1';
        const id = 'oval-1';

        const oval = factory.createFromLine(id, line);

        expect(oval).toBeInstanceOf(Oval);
        expect(oval?.id).toBe(id);

        // координаты углов
        const first = oval?.getFirstCorner();
        const second = oval?.getSecondCorner();

        expect(first?.getX()).toBe(-2);
        expect(first?.getY()).toBe(-1);
        expect(second?.getX()).toBe(2);
        expect(second?.getY()).toBe(1);
    });

    it('returns null for line with insufficient values', () => {
        const line = '1 2 3';
        const id = 'oval-2';

        const oval = factory.createFromLine(id, line);

        expect(oval).toBeNull();
    });

    it('returns null for line with non numeric value', () => {
        const line = '1 2a 3 4';
        const id = 'oval-3';

        const oval = factory.createFromLine(id, line);

        expect(oval).toBeNull();
    });

    it('returns null for completely empty line', () => {
        const line = '   ';
        const id = 'oval-4';

        const oval = factory.createFromLine(id, line);

        expect(oval).toBeNull();
    });
});
