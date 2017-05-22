import { deepEqual } from 'assert';
import { cascade, clone, mixin } from './object';

describe('object', () => {
    const eq = deepEqual;

    describe('#clone()', () => {
        const e = {name: 'p', contents: 'hello'};
        const e2 = clone(e);
        e2.name = 'h1';
        it('should not overwrite original', () => {
            eq(e.name, 'p');
        });

        it('should have expected contents', () => {
            eq(e2.name, 'h1');
            eq(e2.contents, 'hello');
        });
    });

    describe('#mixin()', () => {
        it('should merge objects', () => {
            eq(mixin({a: 1, b: 2}, {a: 3, c: 4}), {a: 3, b: 2, c: 4});
            eq(cascade([{a: 1, b: 2}, {a: 3, c: 4}]), {a: 3, b: 2, c: 4});
        });

        it('should not override defined properties with undefined ones', () => {
            eq(mixin({a: 1}, {a: undefined}), {a: 1});
        });
    });
});
