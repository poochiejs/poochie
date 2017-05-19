var object = require('./object');
var assert = require('assert');
var eq = assert.deepEqual;

describe('object', function() {
    describe('#clone()', function() {
        var e = {name: 'p', contents: 'hello'};
        var e2 = object.clone(e);
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
        var mixin = object.mixin;
        var cascade = object.cascade;

        it('should merge objects', function() {
            eq(mixin({a: 1, b: 2}, {a: 3, c: 4}), {a: 3, b: 2, c: 4});
            eq(cascade([{a: 1, b: 2}, {a: 3, c: 4}]), {a: 3, b: 2, c: 4});
        });

        it('should not override defined properties with undefined ones', function() {
            eq(mixin({a: 1}, {a: undefined}), {a: 1});
        });
    });
});
