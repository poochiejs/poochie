//
// Observable JS
//

// Publishers and Subscribers share the Observable
// interface, which includes a get() and subscribe()
// function.
export class Observable {
    protected subscribers: Array<(val: any) => void>;

    constructor() {
      this.subscribers = [];
    }

    public subscribe(f: (val: any) => void): void {
        this.subscribers.push(f);
    }

    // o.map(f) is a shorthand for observable.subscriber([o], f)
    public map(f: (val: any) => any): Subscriber {
        return subscriber([this], f);
    }

    public get(): any {
        return null;
    }

    protected invalidateSubscribers(): void {
        for (const f of this.subscribers) {
            f(undefined);
        }
    }
}

// tslint:disable-next-line:max-classes-per-file
export class Publisher extends Observable {
    private value: any;

    constructor(v: any) {
        super();
        this.value = v;
    }

    public set(v: any): void {
        this.value = v;
        this.invalidateSubscribers();
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
    private f: any;
    private oArgs: null | Observable;
    private args: any[];

    constructor(args: any[] | Observable, f: (...rest) => any) {
        super();
        this.valid = false;
        this.f = f;
        this.oArgs = null;
        this.args = [];

        let argsArr: any[];

        // Handle an observable list of subscribers.
        if (args instanceof Observable) {
            this.oArgs = args;
            argsArr = this.oArgs.get();
            this.oArgs.subscribe(() => {
                // TODO: unsubscribe previous values.
                this.args = [];
                const xs = this.oArgs.get();
                for (const x of xs) {
                    this.addArg(x);
                }
                this.invalidate();
            });
        } else {
            argsArr = args;
        }

        for (const arg of argsArr) {
            this.addArg(arg);
        }
    }

    public addArg(o: any): void {
        this.args.push(o);
        if (o instanceof Observable) {
            o.subscribe(() => {
                this.invalidate();
            });
        }
    }

    public hasArgs(): boolean {
        return this.args.length > 0;
    }

    public invalidate(): void {
        if (this.valid) {
            this.valid = false;
            this.invalidateSubscribers();
        }
    }

    public get(): any {
        if (this.valid) {
            return this.value;
        } else {
            const vals = this.args.map((o) => o instanceof Observable ? o.get() : o);
            const oldValue = this.value;
            this.value = this.f.apply(null, vals);
            this.valid = true;

            if (this.value !== oldValue && this.subscribers) {
                this.subscribers.forEach((f) => {
                    f(this.value);
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
export function lift(f: (...xs) => any): (...ys) => Subscriber {
    return (...args) => subscriber(args, f);
}

// Handy function to capture the current state of an object containing observables
export function snapshot(o: any): any {
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

export function publisher(v: any): Publisher {
    return new Publisher(v);
}
