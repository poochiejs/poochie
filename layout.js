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
    function cat(as, xs, setPos) {
        var ys = xs;
        var zs = {};
        if (ys instanceof observable.Observable) {
            xs = ys.get();
        }
        for (var i = 0; i < xs.length; i += 1) {
            zs[i] = setPos(xs[i]);
        }
        return dom.element({name: 'div', contents: zs});
    }

    function clone(o1) {
        var o2 = {};
        for (var k in o1) {
            if (o1.hasOwnProperty(k)) {
                o2[k] = o1[k];
            }
        }
        return o2;
    }

    function setPosition(e1, pos) {
        var e2 = clone(e1);
        e2.style = e2.style ? dom.mixin(e2.style, pos) : pos;
        return e2;
    }

    // Set the horizontal position of a 2D element
    function setHPos(x) {
        return setPosition(x, {
            cssFloat: 'left',
            clear: 'none'
        });
    }

    // Concatenate elements horizontally
    function hcat(as, xs) {
        if (as && as.constructor === Array) {
            xs = as;
            as = {};
        }
        return cat(as, xs, setHPos);
    }
    
    // Set the vertical position of a 2D element
    function setVPos(x) {
        return setPosition(x, {
            cssFloat: 'left',
            clear: 'both'
        });
    }

    function setVPosRight(x) {
        return setPosition(x, {
            cssFloat: 'right',
            clear: 'both'
        });
    }
    
    // Concatenate elements vertically
    function vcat(as, xs) {
        if (as && as.constructor === Array) {
            xs = as;
            as = {};
        }
        var setPos = as.align === 'right' ? setVPosRight : setVPos;
        return cat(as, xs, setPos);
    }
    
    define({
        hcat: hcat,
        vcat: vcat,
        gap: gap
    });
}

require(deps, onReady);

