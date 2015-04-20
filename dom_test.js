//
// Tests!
//

var dom = require('./dom');
var assert = require('assert');

//
// Test 'element' and 'clone'.
//
(function() {
    var e = dom.element({name: 'p', contents: 'hello'});
    assert.equal(e.name, 'p');
    assert.equal(e.contents, 'hello');

    var e2 = dom.clone(e);
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
    var z = dom.mixin(x, y);
    assert.equal(z.a, 10);
    assert.equal(z.b, 2);
    assert.equal(z.c, 30);
})();

module.exports = 'passed!';

