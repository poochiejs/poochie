import { deepEqual } from 'assert';
import * as observable from './observable';

describe('observable', () => {
    const eq = deepEqual;
    const pub = observable.publisher;

    // Observable values without objects.
    describe('#publisher()', () => {
        const x = pub(5);
        const y = pub(6);

        it('should return its initial value', () => {
            eq(x.get(), 5);
            eq(y.get(), 6);
        });

        it('should return its new value', () => {
            x.set(3);
            eq(x.get(), 3);
        });
    });

    describe('#map()', () => {
        it('should return an observable that applies a function', () => {
            eq(pub(3).map((x) => x + 1).get(), 4);
        });
    });

    describe('#subscriber()', () => {
        const x = pub(3);
        const y = pub(6);

        it('should observe changes to publishers', () => {
            const comp = observable.subscriber([x, y], (a, b) => a + b);
            eq(comp.set, undefined);
            eq(comp.get(), 9);

            x.set(5);
            eq(comp.get(), 11);

            // Ensure the result is cached
            eq(comp.get(), 11);
        });

        it('should work the same using lift()', () => {
            // Same as above, but using the lift() helper
            x.set(3);
            const add = observable.lift((a, b) => a + b);
            eq(add(x, y).get(), 9);
        });
    });

    describe('#subscriber() of observables', ()  => {
        const x = pub(1);
        const subs = pub([x, pub(2)]);

        it('should observe changes to observables', () => {
            const comp = observable.subscriber(subs, (a, b) => a + b);
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

    describe('#lift()', () => {
        const add = observable.lift((a, b) => a + b);

        it('should create a function that returns an observable', () => {
            eq(add(pub(3), pub(6)).get(), 9);
            eq(add(pub(3), 6).get(), 9);
        });

        it('should create a chainable function that returns an observable', () => {
            const x = pub(3);
            const comp = add(add(x, 5), 1);
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

    describe('#snapshot()', () => {
        const snapshot = observable.snapshot;

        it('should work trivially for concreate values', () => {
            eq(snapshot(1), 1);
            eq(snapshot([]), []);
            eq(snapshot({}), {});
            eq(snapshot({a: 1}), {a: 1});
        });

        it('should recursively lower observables', () => {
            eq(snapshot(pub(1)), 1);
        });
    });

});
