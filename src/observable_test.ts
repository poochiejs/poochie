import * as observable from './observable';
import { deepEqual } from 'assert';

describe('observable', function() {
    let eq = deepEqual;
    let pub = observable.publisher;

    // Observable values without objects.
    describe('#publisher()', function() {
        let x = pub(5);
        let y = pub(6);

        it('should return its initial value', function() {
            eq(x.get(), 5);
            eq(y.get(), 6);
        });

        it('should return its new value', function() {
            x.set(3);
            eq(x.get(), 3);
        });
    });

    describe('#map()', function() {
        let x = pub(3);

        it('should return an observable that applies a function', function() {
            function inc(a) { return a + 1; }
            eq(x.map(inc).get(), 4);
        });
    });

    describe('#subscriber()', function() {
        let x = pub(3);
        let y = pub(6);
        function add(a, b) { return a + b; }

        it('should observe changes to publishers', function() {
            let comp = observable.subscriber([x, y], add);
            eq(comp.set, undefined);
            eq(comp.get(), 9);

            x.set(5);
            eq(comp.get(), 11);

            // Ensure the result is cached
            eq(comp.get(), 11);
        });

        it('should work the same using lift()', function() {
            // Same as above, but using the lift() helper
            x.set(3);
            let oAdd = observable.lift(add);
            eq(oAdd(x, y).get(), 9);
        });
    });

    describe('#subscriber() of observables', function() {
        let x = pub(1);
        let subs = pub([x, pub(2)]);

        it('should observe changes to observables', function() {
            function add(a, b) { return a + b; }
            let comp = observable.subscriber(subs, add);
            eq(comp.get(), 3);

            subs.set([pub(2), pub(3)]);
            eq(comp.get(), 5);

            // Old args should be unsubscribed.
            eq(comp.valid, true);
            x.set('kaboom');

            // TODO: Add unsubscribe.
            // eq(comp.valid, true);

            eq(comp.get(), 5);
        });
    });

    describe('#lift()', function() {
        function add(a, b) { return a + b; }
          let oAdd = observable.lift(add);

        it('should create a function that returns an observable', function() {
            eq(oAdd(pub(3), pub(6)).get(), 9);
            eq(oAdd(pub(3), 6).get(), 9);
        });

        it('should create a chainable function that returns an observable', function() {
            let x = pub(3);
            let comp = oAdd(oAdd(x, 5), 1);
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
        });
    });

    describe('#snapshot()', function() {
        let snapshot = observable.snapshot;

        it('should work trivially for concreate values', function() {
            eq(snapshot(1), 1);
            eq(snapshot([]), []);
            eq(snapshot({}), {});
            eq(snapshot({a: 1}), {a: 1});
        });

        it('should recursively lower observables', function() {
            eq(snapshot(pub(1)), 1);
        });
    });

});
