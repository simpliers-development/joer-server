import { toArray } from './utils';

describe('isArray util', () => {
    it('Responce is array', () => {
        expect(toArray(1)).toEqual([ 1 ]);
        expect(toArray('1')).toEqual([ '1' ]);
        expect(toArray([])).toEqual([]);
        expect(toArray(undefined)).toEqual([]);
        expect(toArray([ 1, 2, 3 ])).toEqual([ 1, 2, 3 ]);
    });
});
