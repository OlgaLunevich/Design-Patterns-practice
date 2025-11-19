import { Point } from '../src/domain/point';
import { Cone } from '../src/domain/cone';
import { ConeGeometryService } from '../src/services/cone-geometry-service';
import { PI } from '../src/constants/math';

describe('ConeGeometryService', () => {
    const service = new ConeGeometryService();

    it('calculates volume correctly', () => {
        const baseCenter = new Point(0, 0, 0);
        const radius = 3;
        const height = 6;
        const cone = new Cone('cone-1', baseCenter, radius, height);

        const volume = service.getVolume(cone);
        const expectedVolume = (PI * radius * radius * height) / 3;

        expect(service.isValidCone(cone)).toBe(true);
        expect(Math.abs(volume - expectedVolume)).toBeLessThan(1e-6);
    });

    it('calculates surface area correctly', () => {
        const baseCenter = new Point(0, 0, 0);
        const radius = 4;
        const height = 3;
        const cone = new Cone('cone-2', baseCenter, radius, height);

        const area = service.getSurfaceArea(cone);
        const slantHeight = Math.sqrt(radius * radius + height * height);
        const expectedArea = PI * radius * (radius + slantHeight);

        expect(area).toBeGreaterThan(0);
        expect(Math.abs(area - expectedArea)).toBeLessThan(1e-6);
    });

    it('detects base on coordinate plane', () => {
        const baseCenterOnPlane = new Point(1, 2, 0);
        const coneOnPlane = new Cone('cone-3', baseCenterOnPlane, 2, 5);

        const baseCenterOffPlane = new Point(1, 2, 1);
        const coneOffPlane = new Cone('cone-4', baseCenterOffPlane, 2, 5);

        expect(service.isBaseOnCoordinatePlane(coneOnPlane)).toBe(true);
        expect(service.isBaseOnCoordinatePlane(coneOffPlane)).toBe(false);
    });
});
