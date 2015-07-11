//
// Tests!
//

'use strict';

var observable = require('./observable');
var assert = require('assert');

// Observable values without objects.
var x = observable.publisher(5);
var y = observable.publisher(6);

assert.equal(x.get(), 5);
assert.equal(y.get(), 6);

x.set(3);
assert.equal(x.get(), 3);

// Test map() method
var inc = function(a) {return a + 1;};
assert.equal(x.map(inc).get(), 4);

// Test subscriber
var add = function(a, b) {return a + b;};
var comp = observable.subscriber([x, y], add);
assert.equal(comp.set, undefined);
assert.equal(comp.get(), 9);

x.set(5);
assert.equal(comp.get(), 11);

// Same as above, but using the lift() helper
x.set(3);
var oAdd = observable.lift(add);
comp = oAdd(x, y);
assert.equal(comp.get(), 9);

// As as above, but where a dependency is not an observable.
comp = oAdd(x, 6);
assert.equal(comp.get(), 9);

// Multi-level compuation
comp = oAdd(oAdd(x, 5), 1);
assert.equal(comp.get(), 9);

x.set(5);

// Note: the value has not changed yet.
assert.equal(comp.value, 9);
assert.equal(comp.valid, false);

// Call get() to update the computation tree
assert.equal(comp.get(), 11);

// Verify observables are instances of Observable
assert.equal(x instanceof observable.Observable, true);

// Verify subscribers are instances of Observable
assert.equal(comp instanceof observable.Observable, true);

module.exports = 'passed!';
