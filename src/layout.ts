//
// A JavaScript library for 2D layout
//

import { element } from './dom';
import { clone, mixin } from './object';
import { Observable } from './observable';

// gap(n)
//
//     Create empty space of 'n' pixels wide and 'n' pixels tall.
export function gap(n) {
    return element({
        name: 'div',
        style: {width: n + 'px', height: n + 'px'},
    });
}

function setPosition(e1, pos) {
    const e2 = clone(e1);
    e2.style = e2.style ? mixin(e2.style, pos) : pos;
    return e2;
}

// Concatenate elements
function cat(as, xs, pos) {
    function setPositions(xs2) {
        const xs3 = [];
        for (let i = 0; i < xs2.length; i++) {
            xs3[i] = setPosition(xs2[i], pos);
        }
        return xs3;
    }
    let ys;
    if (xs instanceof Observable) {
        ys = xs.map(setPositions);
    } else {
        ys = setPositions(xs);
    }
    return element({name: 'div', contents: ys});
}

// Concatenate elements horizontally
const hPos = {cssFloat: 'left', clear: 'none'};
export function hcat(as, xs?) {
    if (as && (as instanceof Array || as instanceof Observable)) {
        xs = as;
        as = {};
    }
    return cat(as, xs, hPos);
}

// Concatenate elements vertically
const vPos = {cssFloat: 'left', clear: 'both'};
const vPosRight = {cssFloat: 'right', clear: 'both'};
export function vcat(as, xs?) {
    if (as && (as instanceof Array || as instanceof Observable)) {
        xs = as;
        as = {};
    }
    const pos = as.align === 'right' ? vPosRight : vPos;
    return cat(as, xs, pos);
}
