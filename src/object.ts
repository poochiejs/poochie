//
// Module name:
//
//     object
//

interface IDictionary {
    [key: string]: any;
}

// Return a clone of the input object using prototype inheritance.
export function Clone() {
    //
}

export function clone(o) {
    Clone.prototype = o;
    return new Clone();
}

// Return the union of 'o1' and 'o2'.  When both contain the
// same key, the value in 'o2' takes precedence.
export function mixin(o1: IDictionary, o2: IDictionary): IDictionary {
    const o3 = {};
    for (const k of Object.keys(o1)) {
        o3[k] = o1[k];
    }
    for (const k of Object.keys(o2)) {
        if (o2[k] !== undefined) {
            o3[k] = o2[k];
        }
    }
    return o3;
}

// Return the mixin of an array of objects
// cascade(xs) === {} `mixin` xs[0] `mixin` xs[1] `mixin` ... `mixin` xs[-1]
export function cascade(xs: IDictionary[]): IDictionary {
    return xs.reduce(mixin, {});
}
