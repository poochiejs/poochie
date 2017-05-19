//
// A JavaScript library for 2D layout
//
// @ts-check
'use strict';

var dom = require('./dom');
var object = require('./object');
var observable = require('./observable');

// gap(n)
//
//     Create empty space of 'n' pixels wide and 'n' pixels tall.
function gap(n) {
    return dom.element({
        name: 'div',
        style: {width: n + 'px', height: n + 'px'}
    });
}

function setPosition(e1, pos) {
    var e2 = object.clone(e1);
    e2.style = e2.style ? object.mixin(e2.style, pos) : pos;
    return e2;
}

// Concatenate elements
function cat(as, xs, pos) {
    function setPositions(xs2) {
        var xs3 = [];
        for (var i = 0; i < xs2.length; i++) {
            xs3[i] = setPosition(xs2[i], pos);
        }
        return xs3;
    }
    var ys;
    if (xs instanceof observable.Observable) {
        ys = xs.map(setPositions);
    } else {
        ys = setPositions(xs);
    }
    return dom.element({name: 'div', contents: ys});
}

// Concatenate elements horizontally
var hPos = {cssFloat: 'left', clear: 'none'};
function hcat(as, xs) {
    if (as && (as instanceof Array || as instanceof observable.Observable)) {
        xs = as;
        as = {};
    }
    return cat(as, xs, hPos);
}

// Concatenate elements vertically
var vPos = {cssFloat: 'left', clear: 'both'};
var vPosRight = {cssFloat: 'right', clear: 'both'};
function vcat(as, xs) {
    if (as && (as instanceof Array || as instanceof observable.Observable)) {
        xs = as;
        as = {};
    }
    var pos = as.align === 'right' ? vPosRight : vPos;
    return cat(as, xs, pos);
}

module.exports = {
    hcat: hcat,
    vcat: vcat,
    gap: gap
};
