import { Cone } from '../../domain/entities/cone';
import { GeometryResultValidator } from '../../shared/validation/geometry-result-validator';
import { logger } from '../../infrastructure/logger/logger';
import { PI, EPSILON } from '../../shared/constants/math';

export class ConeGeometryService {
    private readonly resultValidator: GeometryResultValidator;

    constructor(resultValidator: GeometryResultValidator = new GeometryResultValidator()) {
        this.resultValidator = resultValidator;
    }

    isValidCone(cone: Cone): boolean {
        return cone.getRadius() > 0 && cone.getHeight() > 0;
    }

    getVolume(cone: Cone): number {
        const r = cone.getRadius();
        const h = cone.getHeight();

        const rawVolume = (PI * r * r * h) / 3;

        const result = this.resultValidator.validate(rawVolume);

        if (!result.isValid || result.value === undefined) {
            logger.error({ errors: result.errors }, 'Invalid volume calculated for cone');
            return 0;
        }

        return result.value;
    }

    getSurfaceArea(cone: Cone): number {
        const r = cone.getRadius();
        const h = cone.getHeight();

        const slantHeight = Math.sqrt(r * r + h * h);
        const rawArea = PI * r * (r + slantHeight);

        const result = this.resultValidator.validate(rawArea);

        if (!result.isValid || result.value === undefined) {
            logger.error({ errors: result.errors }, 'Invalid surface area calculated for cone');
            return 0;
        }

        return result.value;
    }

    //  Проверяет, находится ли основание конуса на одной из координатных плоскостей.
    //  Для упрощения считаем, что ось конуса направлена вдоль оси OZ,
    //  поэтому основание лежит в плоскости z = const.
    //  Тогда основание на координатной плоскости, если z0 ≈ 0 (плоскость OXY).

    isBaseOnCoordinatePlane(cone: Cone): boolean {
        const z0 = cone.getBaseCenter().getZ() ?? 0;
        return Math.abs(z0) < EPSILON;
    }
     // Вычисляет объёмы двух частей конуса,
     // получающихся при рассечении его плоскостью OXY (z = 0).
     //
     // upperVolume — часть с z >= 0
     // lowerVolume — часть с z <= 0

    getVolumeSplitByOxyPlane(cone: Cone): { upperVolume: number; lowerVolume: number } {
        const baseCenterZ = cone.getBaseCenter().getZ() ?? 0;
        const height = cone.getHeight();
        const apexZ = baseCenterZ + height;

        const totalVolume = this.getVolume(cone);

        // Если конус целиком "над" плоскостью OXY (z >= 0)
        if (baseCenterZ >= 0 && apexZ >= 0) {
            const upperResult = this.resultValidator.validate(totalVolume);
            if (!upperResult.isValid || upperResult.value === undefined) {
                logger.error({ errors: upperResult.errors }, 'Invalid upper volume after split');
                return { upperVolume: 0, lowerVolume: 0 };
            }

            return {
                upperVolume: upperResult.value,
                lowerVolume: 0,
            };
        }

        // Если конус целиком "под" плоскостью OXY (z <= 0)
        if (baseCenterZ <= 0 && apexZ <= 0) {
            const lowerResult = this.resultValidator.validate(totalVolume);
            if (!lowerResult.isValid || lowerResult.value === undefined) {
                logger.error({ errors: lowerResult.errors }, 'Invalid lower volume after split');
                return { upperVolume: 0, lowerVolume: 0 };
            }

            return {
                upperVolume: 0,
                lowerVolume: lowerResult.value,
            };
        }

        // Иначе плоскость z=0 пересекает конус
        // Используем подобие конусов:
        // высота маленького конуса (выше плоскости) = apexZ - 0 = apexZ
        // полная высота = height
        // => коэффициент подобия по линейным размерам t = apexZ / height
        // => объём маленького конуса: V_small = V_total * t^3
        const t = apexZ / height;
        const rawUpper = totalVolume * t * t * t;
        const rawLower = totalVolume - rawUpper;

        const upperResult = this.resultValidator.validate(rawUpper);
        const lowerResult = this.resultValidator.validate(rawLower);

        if (!upperResult.isValid || upperResult.value === undefined) {
            logger.error({ errors: upperResult.errors }, 'Invalid upper volume calculated after split');
            return { upperVolume: 0, lowerVolume: 0 };
        }

        if (!lowerResult.isValid || lowerResult.value === undefined) {
            logger.error({ errors: lowerResult.errors }, 'Invalid lower volume calculated after split');
            return { upperVolume: 0, lowerVolume: 0 };
        }

        return {
            upperVolume: upperResult.value,
            lowerVolume: lowerResult.value,
        };
    }
}
