import { clone, mixin, cascade } from './object';
import { deepEqual } from 'assert';

describe('object', function() {
    let eq = deepEqual;

    describe('#clone()', function() {
        let e = {name: 'p', contents: 'hello'};
        let e2 = clone(e);
        e2.name = 'h1';
        it('should not overwrite original', function() {
            eq(e.name, 'p');
        });

        it('should have expected contents', function() {
            eq(e2.name, 'h1');
            eq(e2.contents, 'hello');
        });
    });

    describe('#mixin()', function() {
        it('should merge objects', function() {
            eq(mixin({a: 1, b: 2}, {a: 3, c: 4}), {a: 3, b: 2, c: 4});
            eq(cascade([{a: 1, b: 2}, {a: 3, c: 4}]), {a: 3, b: 2, c: 4});
        });

        it('should not override defined properties with undefined ones', function() {
            eq(mixin({a: 1}, {a: undefined}), {a: 1});
        });
    });
});
