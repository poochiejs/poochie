//
// Tests!
//

var observable = require('./observable');
var assert = require('assert');
var eq = assert.deepEqual;
var pub = observable.publisher;

// Observable values without objects.
(function testPublisher() {
    var x = pub(5);
    var y = pub(6);

    eq(x.get(), 5);
    eq(y.get(), 6);

    x.set(3);
    eq(x.get(), 3);
})();

// Test map() method.
(function testMap() {
    var x = pub(3);

    function inc(a) { return a + 1; }
    eq(x.map(inc).get(), 4);
})();

// Test subscriber.
(function testSubscriber() {
    var x = pub(3);
    var y = pub(6);

    function add(a, b) { return a + b; }
    var comp = observable.subscriber([x, y], add);
    eq(comp.set, undefined);
    eq(comp.get(), 9);

    x.set(5);
    eq(comp.get(), 11);

    // Ensure the result is cached
    eq(comp.get(), 11);

    // Same as above, but using the lift() helper
    x.set(3);
    var oAdd = observable.lift(add);
    eq(oAdd(x, y).get(), 9);
})();

// Test observable list of subscriber.
(function testObservableSubscribers() {
    var x = pub(1);
    var subs = pub([x, pub(2)]);

    function add(a, b) { return a + b; }
    var comp = observable.subscriber(subs, add);
    eq(comp.get(), 3);

    subs.set([pub(2), pub(3)]);
    eq(comp.get(), 5);

    // Old args should be unsubscribed.
    eq(comp.valid, true);
    x.set('kaboom');

    // TODO: Add unsubscribe.
    // eq(comp.valid, true);

    eq(comp.get(), 5);
})();

// Test 'lift' utility.
(function testLift() {
    function add(a, b) { return a + b; }
    var oAdd = observable.lift(add);
    eq(oAdd(pub(3), pub(6)).get(), 9);
    eq(oAdd(pub(3), 6).get(), 9);
})();

// Test multi-level compuation.
(function testMultiLevel() {
    function add(a, b) { return a + b; }
    var oAdd = observable.lift(add);

    var x = pub(3);
    var comp = oAdd(oAdd(x, 5), 1);
    eq(comp.get(), 9);

    x.set(5);

    // Note: the value has not changed yet.
    eq(comp.value, 9);
    eq(comp.valid, false);

    // Call get() to update the computation tree
    eq(comp.get(), 11);

    // Verify observables are instances of Observable
    eq(x instanceof observable.Observable, true);

    // Verify subscribers are instances of Observable
    eq(comp instanceof observable.Observable, true);
})();

(function testSnapshot() {
    var snapshot = observable.snapshot;

    eq(snapshot(1), 1);
    eq(snapshot([]), []);
    eq(snapshot({}), {});
    eq(snapshot({a: 1}), {a: 1});
    eq(snapshot(pub(1)), 1);
})();

module.exports = 'passed!';
