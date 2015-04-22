Venus
===

It's like Mercury.js, but a little closer to home.


Introduction
---

[Examples] (https://github.com/garious/venus-examples)

Venus is reactive frontend micro-framework.  It was derived from the Yoink
standard library, but unlike Yoink, uses the CommonJS module format so that
it can be used with npm and browserify.


Venus vs Mercury
---

Venus and Mercury are similar in scope.  Both provide libraries and programming
techniques for defining testable, dynamic components in JavaScript.  Some
differences:

* Venus does not use virtual-dom
* Venus is compact, it's 1.8kb min.gzip.js, that's 5 times smaller than Mercury.
* Venus is lean, it's an afternoon's read, under 500 LoC.

Venus chooses a slightly different abstraction than Mercury.  Both implement the
concept of observable variables that represent the application's dynamic
behavior.  But with Mercury, one keeps the app's state machine separate from the
application.  The application is then rendered from snapshots of that state, and
then the DOM is diff'ed against the previous rendering to determine what
changed.  With Venus, the virtual DOM is aware of observables.  When the virtual
DOM is rendered, the renderer detects the presence of observables, and sets up
handlers that modify the DOM directly.  No diffs needed.


Inspirations
---

* Yoink
* Mercury.js
* Bacon.js
* Fran
* RxJS


Development
---

To download this package's dependencies:

```bash
$ npm install
```

To run the unit tests:

```bash
$ npm test
```
