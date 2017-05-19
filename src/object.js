//
// Module name:
//
//     object
//
// @ts-check
'use strict';

// Return a clone of the input object using prototype inheritance.
function Clone() {}
function clone(o) {
    Clone.prototype = o;
    return new Clone();
}

// Return the union of 'o1' and 'o2'.  When both contain the
// same key, the value in 'o2' takes precedence.
function mixin(o1, o2) {
    var o3 = {};
    var k;
    var i;
    var keys = Object.keys(o1);
    for (i = 0; i < keys.length; i++) {
        k = keys[i];
        o3[k] = o1[k];
    }
    keys = Object.keys(o2);
    for (i = 0; i < keys.length; i++) {
        k = keys[i];
        if (o2[k] !== undefined) {
            o3[k] = o2[k];
        }
    }
    return o3;
}

// Return the mixin of an array of objects
// cascade(xs) === {} `mixin` xs[0] `mixin` xs[1] `mixin` ... `mixin` xs[-1]
function cascade(xs) {
    return xs.reduce(mixin, {});
}

module.exports = {
    clone: clone,
    mixin: mixin,
    cascade: cascade
};
