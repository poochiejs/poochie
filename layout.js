//
// A JavaScript library for 2D layout
//

// hcat(['a','b','c']) === 'abc'
// vcat(['a','b','c']) === 'a\nb\nc'
//
// To put space between elements, use the gap(nPixels) function.

var deps = [
    'dom.js',
    'observable.js'
];

function onReady(dom, observable) {

    // gap(n)
    //
    //     Create empty space of 'n' pixels wide and 'n' pixels tall.
    function gap(n) {
        return dom.element({name: 'div', style: {width: n + 'px', height: n + 'px'}});
    }

    // Concatenate elements
    function cat(as, xs, pos) {
        function setPositions(xs) {
            var ys = [];
            for (var i = 0; i < xs.length; i += 1) {
                ys[i] = setPosition(xs[i], pos);
            }
            return ys;
        }
        var zs;
        if (xs instanceof observable.Observable) {
            zs = xs.map(setPositions);
        } else {
            zs = setPositions(xs);
        }
        return dom.element({name: 'div', contents: zs});
    }

    function setPosition(e1, pos) {
        var e2 = dom.clone(e1);
        e2.style = e2.style ? dom.mixin(e2.style, pos) : pos;
        return e2;
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
    
    define({
        hcat: hcat,
        vcat: vcat,
        gap: gap
    });
}

require(deps, onReady);

