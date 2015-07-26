//
// Tests!
//

'use strict';

var object = require('./object');
var assert = require('assert');
var eq = assert.deepEqual;

//
// Test 'clone'.
//
(function testClone() {
    var e = {name: 'p', contents: 'hello'};
    var e2 = object.clone(e);
    e2.name = 'h1';
    eq(e.name, 'p');  // Did not overwrite original.
    eq(e2.name, 'h1');
    eq(e2.contents, 'hello');
})();

//
// Test 'mixin' and 'cascade'.
//
(function testMixin() {
    var mixin = object.mixin;
    var cascade = object.cascade;

    eq(mixin({a: 1, b: 2}, {a: 3, c: 4}), {a: 3, b: 2, c: 4});
    eq(cascade([{a: 1, b: 2}, {a: 3, c: 4}]), {a: 3, b: 2, c: 4});

    // Undefined properties should not override defined ones.
    eq(mixin({a: 1}, {a: undefined}), {a: 1});
})();

module.exports = 'passed!';
