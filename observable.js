//
// Observable JS
//

// Observable values
function Observable(v) {
    this.value = v;
}

Observable.prototype.set = function(v) {
    this.value = v;
    if (this.subscribers) {
        this.subscribers.forEach(function(f) {
            f(this);
        });
    }
    return this;
};

Observable.prototype.get = function() {
    return this.value;
};

Observable.prototype.subscribe = function(f) {
    if (!this.subscribers) {
        this.subscribers = [f];
    } else {
        this.subscribers.push(f);
    }
    return this;
};

// Observable computations.  thunk() takes a list of observables
// and a callback function and returns an observable.  Any time
// a value is requested AND an input has changed, the given callback
// is executed, and its return value is returned.
Thunk.prototype = new Observable();
Thunk.prototype.constructor = Thunk;
function Thunk(xs, f) {
    this.valid = false;
    this.f = f;
    this.publishers = xs;

    var me = this;  // Avoid 'this' ambiguity.
    xs.forEach(function(o) {
        if (o.get && o.subscribe) {
            o.subscribe(function (val, obs) {
                if (me.valid) {
                    me.valid = false;
                    if (me.subscribers) {
                        me.subscribers.forEach(function(f) {
                            f(me);
                        });
                    }
                }
            });
        }
    });
}

Thunk.prototype.get = function() {
   if (this.valid) {
     return this.value;
   } else {
     var vals = this.publishers.map(function(o){
         return o.get && o.subscribe ? o.get() : o;
     });

     var oldValue = this.value;
     this.value = this.f.apply(null, vals);
     this.valid = true;

     if (this.value !== oldValue && this.subscribers) {
         this.subscribers.forEach(function(f) {
             f(this);
         });
     }

     return this.value;
   }
};

Thunk.prototype.subscribe = function(f) {
    if (!this.subscribers) {
        this.subscribers = [f];
    } else {
        this.subscribers.push(f);
    }
    return this;
};

function thunk(xs, f) {
    return new Thunk(xs, f);
}

// Handy function to lift a raw function into the observable realm
function lift(f) {
    return function() {
       var args = Array.prototype.slice.call(arguments);
       return thunk(args, f);
    };
}


// Handy function to capture the current state of an object containing observables
function snapshot(o) {
    if (typeof o === 'object') {
        if (o.get && o.subscribe) {
            return snapshot( o.get() );
        } else {
            if (o.constructor === Array) {
                return o.map(snapshot);
            } else {
                var o2 = {};
                var k;
                for (k in o) {
                    if (o.hasOwnProperty(k)) {
                        o2[k] = snapshot(o[k]);
                    }
                }
                return o2;
            }
        }
    } else {
        return o;
    }
}

function observe(v) {
    return new Observable(v);
}

yoink.define({
    Observable: Observable,
    observe: observe,
    Thunk: Thunk,
    thunk: thunk,
    lift: lift,
    snapshot: snapshot
});

