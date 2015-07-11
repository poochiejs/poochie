//
// Tests!
//

var object = require('./object');
var assert = require('assert');

//
// Test 'clone'.
//
(function() {
    var e = {name: 'p', contents: 'hello'};
    var e2 = object.clone(e);
    e2.name = 'h1';
    assert.equal(e.name, 'p');  // Did not overwrite original.
    assert.equal(e2.name, 'h1');
    assert.equal(e2.contents, 'hello');
})();

//
// Test 'mixin'.
//
(function() {
    var x = {a: 1, b: 2};
    var y = {a: 10, c: 30};
    var z = object.mixin(x, y);
    assert.equal(z.a, 10);
    assert.equal(z.b, 2);
    assert.equal(z.c, 30);
})();

module.exports = 'passed!';
