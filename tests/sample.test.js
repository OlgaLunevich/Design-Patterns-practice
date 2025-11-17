"use strict";
describe('sample test', () => {
    it('adds numbers correctly', () => {
        const a = 2;
        const b = 3;
        const result = a + b;
        expect(result).toBe(5);
        expect(result).not.toBe(4);
    });
});
