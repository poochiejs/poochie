//
// Module name:
//
//     tag
//
// Description:
//
//     'tag' is a JavaScript module for creating HTML elements.
//     The module exposes two object constructors, 'createElement' and 'tag'.
//     The functions accept the same arguments, an HTML tag name, an attributes
//     object, an array of subelements, and an eventHandlers object.  The
//     difference is that 'tag' postpones the creation of an underlying DOM
//     element, whereas 'createElement' creates and returns the DOM element.
//
//     createElement(x) === tag(x).render()
//
//     By postponing the creation of the DOM, we can unit test modules
//     that return tag objects without requiring a browser or a browser
//     simulator such as JsDom or Zombie.  A bare-bones JavaScript interpreter
//     such as Node.js will suffice.
//
//     Q: What if my application dynamically updates other element attributes?
//
//     A: Instead of setting the attribute directly, express the dependency with
//        an Observable variable.  Your event handler should set the observable
//        variable and your tag should be constructed using the observable.  The
//        tag library will detect the observable attribute and update the DOM
//        element any time its value changes.
//
//
//     Q: Why doesn't tag() automatically create observables for every tag
//        attribute.
//
//     A: If your application is mostly static content, creating the extra
//        objects could delay startup time and consume memory the application
//        doesn't need.
//


var deps = [
    'observable.js'
];

function onReady(observable) {

    // Add style 's' with value 'style[s]' to the DOM element 'e'.
    function addStyle(e, style, s) {
        if (style[s] instanceof observable.Observable) {
            e.style[s] = style[s].get();
            style[s].subscribe(function(obs) {e.style[s] = obs.get();});
        } else {
            e.style[s] = style[s];
        }
    }

    // Add attribute 'k' with value 'v' to the DOM element 'e'.
    function addAttribute(e, k, v) {
        if (v instanceof observable.Observable) {
            e.setAttribute(k, v.get());
            v.subscribe(function(obs) {e[k] = obs.get();});
            if (v.set) {
                 e.addEventListener('change', function(evt) {v.set(evt.target[k]);});
            }
        } else {
            e.setAttribute(k, v);
        }
    }

    function mkSetChildren(e) {
        return function (obs) {
            e.innerHTML = '';
            var xs = obs.get();
            for (var i = 0; i < xs.length; i++) {
                var x = xs[i];
                x = typeof x === 'string' ? document.createTextNode(x) : x;
                e.appendChild(typeof x.render === 'function' ? x.render() : x);
            }
        };
    }


    // Create a DOM element with tag name 'nm', attributes object 'as', style object 'sty',
    // an array of subelements 'xs', and an object of event handlers 'es'.
    function createElement(ps) {

        if (typeof ps === 'string') {
            ps = {name: ps};
        }

        // Create DOM node
        var e = document.createElement(ps.name);

        // Add attributes
        var as = ps.attributes;
        var k;
        if (as) {
            for (k in as) {
                if (as.hasOwnProperty(k) && k !== 'style' && as[k] !== undefined) {
                    addAttribute(e, k, as[k]);
                }
            }
        }

        // Add Style
        var style = ps.style;
        if (style) {
            for (var s in style) {
                if (style.hasOwnProperty(s) && style[s] !== undefined) {
                    addStyle(e, style, s);
                }
            }
        }

        // Add child elements
        var xs = ps.contents;
        if (xs) {
            if (typeof xs === 'string') {
                e.appendChild(document.createTextNode(xs));
            } else {
                if (xs instanceof observable.Observable) {
                    var xsObs = xs;
                    xs = xsObs.get();
                    xsObs.subscribe(mkSetChildren(e));
                }

                for (var i = 0; i < xs.length; i++) {
                    var x = xs[i];
                    x = typeof x === 'string' ? document.createTextNode(x) : x;
                    e.appendChild(typeof x.render === 'function' ? x.render() : x);
                }
            }
        }

        // Add event handlers
        var es = ps.handlers;
        if (typeof es === 'object') {
            for (k in es) {
                if (es.hasOwnProperty(k)) {
                    e.addEventListener(k, es[k]);
                }
            }
        }

        return e;
    }

    // Overwrite 'obj' with defined keys in 'newObj'
    function mixin(obj, newObj) {
        for (var k in newObj) {
            if (newObj.hasOwnProperty(k) && newObj[k] !== undefined) {
                obj[k] = newObj[k];
            }
        }

        return obj;
    }

    // left-fold style objects
    // cascadeStyles(xs) === {} `mixin` xs[0] `mixin` xs[1] `mixin` ... `mixin` xs[-1]
    function cascadeStyles(xs) {
        return xs.reduce(mixin, {});
    }

    //
    // tag({name, attributes, style, contents, handlers})
    //
    function Tag(as) {

        if (typeof as === 'string') {
            as = {name: as};
        }

        this.name = as.name;

        if (as.attributes !== undefined) { this.attributes = as.attributes; }
        if (as.style      !== undefined) { this.style      = as.style; }
        if (as.contents   !== undefined) { this.contents   = as.contents; }
        if (as.handlers   !== undefined) { this.handlers   = as.handlers; }
    }

    Tag.prototype.render = function() {
         return createElement(this);
    };

    Tag.prototype.setPosition = function (pos) {
        if (!this.attributes) {
            this.attributes = {};
        }

        if (!this.style) {
            this.style = {};
        }

        mixin(this.style, pos);

        return this;
    };

    function tag(as) {
        return new Tag(as);
    }

    define({
        createElement: createElement,
        mixin:         mixin,
        cascadeStyles: cascadeStyles,
        Tag:           Tag,
        tag:           tag
    });
}

require(deps, onReady);


