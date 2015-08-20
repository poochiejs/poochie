//
// Module name:
//
//     dom
//
// Description:
//
//     'dom' is a JavaScript module for creating HTML elements.
//     The module exposes two object constructors, 'createElement' and 'element'.
//     The functions accept the same arguments, an HTML tag name, an attributes
//     object, an array of subelements, and an eventHandlers object.  The
//     difference is that 'element' postpones the creation of an underlying DOM
//     element, whereas 'createElement' creates and returns the DOM element.
//
//     createElement(x) === element(x).render()
//
//     By postponing the creation of the DOM, we can unit test modules
//     that return element objects without requiring a browser or a browser
//     simulator such as JsDom or Zombie.  A bare-bones JavaScript interpreter
//     such as Node.js will suffice.
//

'use strict';

var observable = require('./observable');
var intervalTimers = [];

// Add style 's' with value 'style[s]' to the DOM element 'e'.
function addStyle(e, subscriber, style, s) {
    if (style[s] instanceof observable.Observable) {
        e.style[s] = style[s].get();
        var o = style[s].map(function(v) { e.style[s] = v; });
        subscriber.addArg(o);
    } else {
        e.style[s] = style[s];
    }
}

// Add attribute 'k' with value 'v' to the DOM element 'e'.   If the
// attribute's value is 'undefined', it will be ignored.  If the
// attribute's value is an observable, then any time its value is
// 'undefined', the attribute will be removed.
function addAttribute(e, subscriber, k, v) {
    if (v instanceof observable.Observable) {
        var val = v.get();
        if (val !== undefined) {
            e[k] = val;
        }
        var o = v.map(function(v2) {
            if (v2 !== undefined) {
                e[k] = v2;
            } else {
                delete e[k];
            }
        });
        subscriber.addArg(o);
    } else {
        e[k] = v;
    }
}

function setChildren(subscriber, e, xs) {
    e.innerHTML = '';
    for (var i = 0; i < xs.length; i++) {
        var x = render(xs[i]);
        e.appendChild(x);
    }
}

// Create a DOM element with tag name 'nm', attributes object 'as', style object 'sty',
// an array of subelements 'xs', and an object of event handlers 'es'.
function createElementAndSubscriber(ps) {

    // Create DOM node
    var e = global.document.createElement(ps.name);

    // Create a subscriber to watch any observables.
    var subscriber = observable.subscriber([], function() { return e; });

    // Add attributes
    var as = ps.attributes;
    var i, k, keys;
    if (as) {
        keys = Object.keys(as);
        for (i = 0; i < keys.length; i++) {
            k = keys[i];
            if (k !== 'style' && as[k] !== undefined) {
                addAttribute(e, subscriber, k, as[k]);
            }
        }
    }

    // Add Style
    var style = ps.style;
    if (style) {
        keys = Object.keys(style);
        for (i = 0; i < keys.length; i++) {
            k = keys[i];
            if (style[k] !== undefined) {
                addStyle(e, subscriber, style, k);
            }
        }
    }

    // Add child elements
    var xs = ps.contents;
    if (xs) {
        if (typeof xs === 'string') {
            e.appendChild(global.document.createTextNode(xs));
        } else {
            if (xs instanceof observable.Observable) {
                var xsObs = xs;
                xs = xsObs.get();
                var o = xsObs.map(function(ys) {
                    setChildren(subscriber, e, ys);
                });
                subscriber.addArg(o);
            }
            setChildren(subscriber, e, xs);
        }
    }

    // Add event handlers
    var es = ps.handlers;
    if (typeof es === 'object') {
        keys = Object.keys(es);
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            e.addEventListener(k, es[k]);
        }
    }

    if (ps.focus instanceof observable.Observable) {
        subscriber.addArg(ps.focus.map(function setFocus(focus) {
            function onTimeout() {
                if (focus) {
                    e.focus();
                } else {
                    e.blur();
                }
            }

            // Use setTimeout so that focus is set after the DOM has had an
            // opportunity to render other attributes that may have changed,
            // such as style.display.
            setTimeout(onTimeout, 0);
        }));
    }

    return {
        element: e,
        subscriber: subscriber
    };
}

function createElement(ps) {
    if (typeof ps === 'string') {
        ps = {name: ps};
    }

    var obj = createElementAndSubscriber(ps);

    if (obj.subscriber.args.length > 0) {
        var id = setInterval(function() { obj.subscriber.get(); }, 30);
        intervalTimers.push(id);
    }

    return obj.element;
}

//
// clear all interval timers created by createElement()
//
function clearIntervalTimers() {
    for (var i = 0; i < intervalTimers.length; i++) {
        clearInterval(intervalTimers[i]);
    }
}

//
// element({name, attributes, style, contents, handlers})
//
function ReactiveElement(as) {

    if (typeof as === 'string') {
        as = {name: as};
    }

    this.name = as.name;

    if (as.attributes !== undefined) {
        this.attributes = as.attributes;
    }

    if (as.style !== undefined) {
        this.style = as.style;
    }

    if (as.contents !== undefined) {
        this.contents = as.contents;
    }

    if (as.handlers !== undefined) {
        this.handlers = as.handlers;
    }

    if (as.focus instanceof observable.Observable) {
        this.focus = as.focus;
    }
}

ReactiveElement.prototype.render = function() {
    return createElement(this);
};

function element(as) {
    return new ReactiveElement(as);
}

// Render a string or object with a render method, such as a ReactiveElement.
function render(e) {
    if (typeof e === 'string') {
        return global.document.createTextNode(e);
    } else if (typeof e.render === 'function') {
        return render(e.render());
    }
    return e;
}

module.exports = {
    createElement: createElement,
    createElementAndSubscriber: createElementAndSubscriber,
    clearIntervalTimers: clearIntervalTimers,
    ReactiveElement: ReactiveElement,
    element: element,
    render: render
};
