//
// A JavaScript library for 2D layout
//

import { element, ReactiveElement } from './dom';
import { clone, mixin } from './object';
import { Observable } from './observable';

// gap(n)
//
//     Create empty space of 'n' pixels wide and 'n' pixels tall.
export function gap(n: number): ReactiveElement {
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

interface IPos {
    cssFloat: string;
    clear: string;
}

interface IAttrs {
  align?: string;
}

type Elements = ReactiveElement[] | Observable;

// Concatenate elements
function cat(xs: Elements, pos: IPos): ReactiveElement {
    function setPositions(xs2) {
        return xs2.map((x) => setPosition(x, pos));
    }
    const ys = xs instanceof Observable ? xs.map(setPositions) : setPositions(xs);
    return element({name: 'div', contents: ys});
}

// Concatenate elements horizontally
const hPos: IPos = {cssFloat: 'left', clear: 'none'};
export function hcat(as: null | IAttrs | Elements, xs?: Elements): ReactiveElement {
    if (as && (as instanceof Array || as instanceof Observable)) {
        xs = as;
        as = {};
    }
    return cat(xs, hPos);
}

// Concatenate elements vertically
const vPos: IPos = {cssFloat: 'left', clear: 'both'};
const vPosRight: IPos = {cssFloat: 'right', clear: 'both'};
export function vcat(as: null | IAttrs | Elements, xs?: Elements): ReactiveElement {
    let attrs: IAttrs;
    if (as && (as instanceof Array || as instanceof Observable)) {
        xs = as;
        attrs = {};
    } else {
        attrs = as;
    }
    const pos = attrs.align === 'right' ? vPosRight : vPos;
    return cat(xs, pos);
}
