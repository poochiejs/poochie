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

import * as observable from './observable';
const intervalTimers = [];

// Add style 's' with value 'style[s]' to the DOM element 'e'.
function addStyle(e, subscriber, style, s) {
    if (style[s] instanceof observable.Observable) {
        e.style[s] = style[s].get();
        const o = style[s].map((v) => { e.style[s] = v; });
        subscriber.addArg(o);
    } else {
        e.style[s] = style[s];
    }
}

// Add style from 'style' object to the DOM element 'e'.
function addStyles(e, subscriber, style) {
    const keys = Object.keys(style);
    for (const k of keys) {
        if (style[k] !== undefined) {
            addStyle(e, subscriber, style, k);
        }
    }
}

// Add attribute 'k' with value 'v' to the DOM element 'e'.   If the
// attribute's value is 'undefined', it will be ignored.  If the
// attribute's value is an observable, then any time its value is
// 'undefined', the attribute will be removed.
function addAttribute(e, subscriber, k, v) {
    if (v instanceof observable.Observable) {
        const val = v.get();
        if (val !== undefined) {
            e[k] = val;
        }
        const o = v.map((v2) => {
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

// Add attributes from 'as' to the DOM element 'e'.
function addAttributes(e, subscriber, as) {
    const keys = Object.keys(as);
    for (const k of keys) {
        if (k !== 'style' && as[k] !== undefined) {
            addAttribute(e, subscriber, k, as[k]);
        }
    }
}

function setChildren(subscriber, e, xs) {
    e.innerHTML = '';
    for (const x of xs) {
        const nd = render(x);
        e.appendChild(nd);
    }
}

// Add contents from array 'xs' to the DOM element 'e'.
function addContents(e, subscriber, xs) {
    if (typeof xs === 'string') {
        e.appendChild(global.document.createTextNode(xs));
    } else {
        if (xs instanceof observable.Observable) {
            const xsObs = xs;
            xs = xsObs.get();
            const o = xsObs.map((ys) => {
                setChildren(subscriber, e, ys);
            });
            subscriber.addArg(o);
        }
        setChildren(subscriber, e, xs);
    }
}

// Add handlers from 'es' to the DOM element 'e'.
function addEventHandlers(e, subscriber, es) {
    const keys = Object.keys(es);
    for (const k of keys) {
        e.addEventListener(k, es[k]);
    }
}

// Add focus handler to the DOM element 'e'.
function addFocusHandler(e, subscriber, oFocus) {
    function setFocus(focus) {
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
    }

    subscriber.addArg(oFocus.map(setFocus));
}

// Create a DOM element with tag name 'nm', attributes object 'as', style object 'sty',
// an array of subelements 'xs', and an object of event handlers 'es'.
export function createElementAndSubscriber(ps) {

    // Create DOM node
    const e = global.document.createElement(ps.name);

    // Create a subscriber to watch any observables.
    const subscriber = observable.subscriber([], () => e);

    // Add attributes
    if (ps.attributes) {
        addAttributes(e, subscriber, ps.attributes);
    }

    // Add Style
    if (ps.style) {
        addStyles(e, subscriber, ps.style);
    }

    // Add child elements
    if (ps.contents) {
        addContents(e, subscriber, ps.contents);
    }

    // Add event handlers
    if (typeof ps.handlers === 'object') {
        addEventHandlers(e, subscriber, ps.handlers);
    }

    // Add focus handler
    if (ps.focus instanceof observable.Observable) {
        addFocusHandler(e, subscriber, ps.focus);
    }

    return {
        element: e,
        subscriber,
    };
}

export function createElement(ps) {
    if (typeof ps === 'string') {
        ps = {name: ps};
    }

    const obj = createElementAndSubscriber(ps);

    if (obj.subscriber.args.length > 0) {
        const id = setInterval(() => { obj.subscriber.get(); }, 30);
        intervalTimers.push(id);
    }

    return obj.element;
}

//
// clear all interval timers created by createElement()
//
export function clearIntervalTimers() {
    for (const timer of intervalTimers) {
        clearInterval(timer);
    }
}

//
// element({name, attributes, style, contents, handlers})
//
export function ReactiveElement(as) {

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

export function element(as) {
    return new ReactiveElement(as);
}

// Render a string or object with a render method, such as a ReactiveElement.
export function render(e) {
    if (typeof e === 'string') {
        return global.document.createTextNode(e);
    } else if (typeof e.render === 'function') {
        return render(e.render());
    }
    return e;
}
