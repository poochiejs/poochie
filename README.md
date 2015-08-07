Poochie
===

[![Join the chat at https://gitter.im/garious/poochie](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/garious/poochie?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Build Status](https://travis-ci.org/garious/poochie.svg)](https://travis-ci.org/garious/poochie)
[![npm version](https://badge.fury.io/js/poochie.svg)](http://badge.fury.io/js/poochie)
[![Test Coverage](https://codeclimate.com/github/garious/poochie/badges/coverage.svg)](https://codeclimate.com/github/garious/poochie/coverage)

Poochie is one outrageous microframework.

Examples
---

[Poochie - TodoMVC] (https://github.com/garious/poochie-todomvc)

[More Examples] (https://github.com/garious/poochie-examples)


Why Poochie
---

I failed to find a web framework that allowed me to write a web app with the
following properties:

* The application description should be a single data-driven, declarative expression.
* It should be possible to incrementally add dynamic behavior and maintain 100%
  line and branch coverage.
* It should be possible to introduce components without affecting the existing
  behavior.


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
