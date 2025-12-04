import { Cone } from '../src/domain/entities/cone';
import { Point } from '../src/domain/entities/point';
import { ConeGeometryService } from '../src/application/services/cone-geometry-service';
import { PI } from '../src/shared/constants/math';

describe('ConeGeometryService - volume split by OXY plane', () => {
    const service = new ConeGeometryService();

    it('returns full volume in upper part when cone is entirely above OXY', () => {
        const baseCenter = new Point(0, 0, 1); // z0 = 1
        const radius = 2;
        const height = 5;
        const cone = new Cone('cone-above', baseCenter, radius, height);

        const totalVolume = (PI * radius * radius * height) / 3;

        const { upperVolume, lowerVolume } = service.getVolumeSplitByOxyPlane(cone);

        expect(upperVolume).toBeGreaterThan(0);
        expect(lowerVolume).toBe(0);
        expect(Math.abs(upperVolume - totalVolume)).toBeLessThan(1e-6);
    });

    it('returns full volume in lower part when cone is entirely below OXY', () => {
        const baseCenter = new Point(0, 0, -10); // z0 = -10, apex = -5
        const radius = 3;
        const height = 5;
        const cone = new Cone('cone-below', baseCenter, radius, height);

        const totalVolume = (PI * radius * radius * height) / 3;

        const { upperVolume, lowerVolume } = service.getVolumeSplitByOxyPlane(cone);

        expect(upperVolume).toBe(0);
        expect(lowerVolume).toBeGreaterThan(0);
        expect(Math.abs(lowerVolume - totalVolume)).toBeLessThan(1e-6);
    });

    it('splits volume correctly when cone intersects OXY', () => {
        // База в z = -5, высота 10 => apex z = 5, плоскость z=0 посередине
        // t = apexZ / height = 5 / 10 = 0.5
        // V_upper = V_total * t^3 = V_total / 8
        // V_lower = 7/8 V_total
        const baseCenter = new Point(0, 0, -5);
        const radius = 2;
        const height = 10;
        const cone = new Cone('cone-split', baseCenter, radius, height);

        const totalVolume = (PI * radius * radius * height) / 3;

        const { upperVolume, lowerVolume } = service.getVolumeSplitByOxyPlane(cone);

        const expectedUpper = totalVolume / 8;
        const expectedLower = totalVolume * (7 / 8);

        expect(upperVolume).toBeGreaterThan(0);
        expect(lowerVolume).toBeGreaterThan(0);
        expect(Math.abs(upperVolume - expectedUpper)).toBeLessThan(1e-6);
        expect(Math.abs(lowerVolume - expectedLower)).toBeLessThan(1e-6);
    });
});
