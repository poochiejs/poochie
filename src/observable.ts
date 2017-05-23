//
// Observable JS
//

// Publishers and Subscribers share the Observable
// interface, which includes a get() and subscribe()
// function.
export class Observable {
    public subscribers: any[];

    constructor() {
      this.subscribers = [];
    }

    public subscribe(f) {
        this.subscribers.push(f);
        return this;
    }

    public invalidateSubscribers() {
        for (const f of this.subscribers) {
            f(this);
        }
    }

    // o.map(f) is a shorthand for observable.subscriber([o], f)
    public map(f) {
        return subscriber([this], f);
    }

    public get() {
        return null;
    }
}

// tslint:disable-next-line:max-classes-per-file
export class Publisher extends Observable {
    public value: any;

    constructor(v: any) {
        super();
        this.value = v;
    }

    public set(v: any) {
        this.value = v;
        this.invalidateSubscribers();
        return this;
    }

    public get(): any {
        return this.value;
    }

}

// Observable computations.  subscriber() takes a list of observables
// and a callback function and returns an observable.  Any time
// a value is requested AND an input has changed, the given callback
// is executed, and its return value is returned.
// tslint:disable-next-line:max-classes-per-file
export class Subscriber extends Observable {
    public valid: boolean;
    public value: any;
    public f: any;
    public oArgs: null | Observable;
    public args: any[];

    constructor(args: any[] | Observable, f) {
        super();
        this.valid = false;
        this.f = f;
        this.oArgs = null;
        this.args = [];

        const me = this;  // Avoid 'this' ambiguity.

        let argsArr: any[];

        // Handle an observable list of subscribers.
        if (args instanceof Observable) {
            this.oArgs = args;
            argsArr = this.oArgs.get();
            this.oArgs.subscribe(() => {
                // TODO: unsubscribe previous values.
                me.args = [];
                const xs = me.oArgs.get();
                for (const x of xs) {
                    me.addArg(x);
                }
                me.invalidate();
            });
        } else {
            argsArr = args;
        }

        for (const arg of argsArr) {
            me.addArg(arg);
        }
    }

    public addArg(o) {
        this.args.push(o);
        const me = this;
        if (o instanceof Observable) {
            o.subscribe(() => {
                me.invalidate();
            });
        }
    }

    public invalidate() {
        if (this.valid) {
            this.valid = false;
            this.invalidateSubscribers();
        }
    }

    public get() {
        if (this.valid) {
            return this.value;
        } else {
            const vals = this.args.map((o) => o instanceof Observable ? o.get() : o);
            const oldValue = this.value;
            this.value = this.f.apply(null, vals);
            this.valid = true;

            if (this.value !== oldValue && this.subscribers) {
                const me = this;
                this.subscribers.forEach((f) => {
                    f(me);
                });
            }

            return this.value;
        }
    }
}

export function subscriber(args: any[] | Observable, f: any): Subscriber {
    return new Subscriber(args, f);
}

// Handy function to lift a raw function into the observable realm
export function lift(f) {
    return (...args) => subscriber(args, f);
}

// Handy function to capture the current state of an object containing observables
export function snapshot(o) {
    if (typeof o === 'object') {
        if (o instanceof Observable) {
            return snapshot(o.get());
        } else {
            if (o instanceof Array) {
                return o.map(snapshot);
            } else {
                const o2 = {};
                for (const k of Object.keys(o)) {
                    o2[k] = snapshot(o[k]);
                }
                return o2;
            }
        }
    } else {
        return o;
    }
}

export function publisher(v): Publisher {
    return new Publisher(v);
}
