import { isArray } from './utils';

describe('isArray util', () => {
    it('Array is array', () => {
        expect(isArray([])).toStrictEqual(true);
    });

    it('Not array is not an array', () => {
        expect(isArray(1)).toStrictEqual(false);
        expect(isArray('hello')).toStrictEqual(false);
        expect(isArray(undefined)).toStrictEqual(false);
        expect(isArray(null)).toStrictEqual(false);
        expect(isArray({})).toStrictEqual(false);
        expect(isArray(Symbol(1))).toStrictEqual(false);
        expect(isArray(() => ({}))).toStrictEqual(false);
    });
});
