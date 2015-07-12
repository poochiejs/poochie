Poochie
===

Poochie is one outrageous microframework.

[![Build Status](https://travis-ci.org/garious/poochie.svg)](https://travis-ci.org/garious/poochie)

[![Test Coverage](https://codeclimate.com/github/garious/poochie/badges/coverage.svg)](https://codeclimate.com/github/garious/poochie/coverage)

Introduction
---

[Examples] (https://github.com/garious/poochie-examples)

Poochie is reactive frontend micro-framework.  It was derived from the Yoink
standard library, but unlike Yoink, uses the CommonJS module format so that
it can be used with npm and browserify.


Poochie vs Mercury
---

Poochie and Mercury are similar in scope.  Both provide libraries and programming
techniques for defining testable, dynamic components in JavaScript.  Some
differences:

* Poochie does not use virtual-dom
* Poochie is compact, it's 1.8kb min.gzip.js, that's 5 times smaller than Mercury.
* Poochie is lean, it's an afternoon's read, under 500 LoC.

Poochie chooses a slightly different abstraction than Mercury.  Both implement the
concept of observable variables that represent the application's dynamic
behavior.  But with Mercury, one keeps the app's state machine separate from the
application.  The application is then rendered from snapshots of that state, and
then the DOM is diff'ed against the previous rendering to determine what
changed.  With Poochie, the virtual DOM is aware of observables.  When the virtual
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

To lint the code and run the unit tests:

```bash
$ npm test
```
