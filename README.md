Poochie
===

[![Join the chat at https://gitter.im/garious/poochie](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/garious/poochie?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Build Status](https://travis-ci.org/poochiejs/poochie.svg)](https://travis-ci.org/poochiejs/poochie)
[![npm version](https://badge.fury.io/js/poochie.svg)](http://badge.fury.io/js/poochie)
[![Test Coverage](https://codeclimate.com/github/poochiejs/poochie/badges/coverage.svg)](https://codeclimate.com/github/poochiejs/poochie/coverage)

Poochie is one outrageous microframework.

Examples
---

[Poochie - TodoMVC] (https://github.com/poochiejs/poochie-todomvc)

[More Examples] (https://github.com/poochiejs/poochie-examples)


Why Poochie
---

I failed to find a web framework that allowed me to write a web app with the
following properties:

* The application description should be a single data-driven, declarative expression.
* It should be possible to incrementally add dynamic behavior and maintain 100%
  line and branch coverage.
* It should be possible to introduce components without affecting the existing
  behavior.


Poochie vs React
---

Poochie is designed for *succinctness* whereas React requires you to split
your application into distinct stateful and stateless pieces, the *controller*,
and the *view*, respectively. As a consequence, the React framework generates
an entirely new virtual DOM tree any time the UI state changes. To make
performance reasonable, it includes a [reconciliation]
(https://facebook.github.io/react/docs/reconciliation.html) pass in its
rendering pipeline. This pass attempts to reduce a O(n^3) algorithm down to a
O(n) one. But even in its best case, O(n) is still far worse than the
O(1) operations that a functionally-equivalent, hand-written JavaScript
application would do. Poochie, on the other hand, is much closer to a
*zero-cost* abstraction. Where React renders a virtual DOM every time any
state changes, Poochie renders a virtual DOM **once**. When the rendering
pass encounters an *observable*, Poochie subscribes to it and updates the
DOM with changes directly - O(1).

Regarding succinctness, Poochie won't bark at you for mixing your controller
code with your view code. It assumes the *component* abstraction is sufficient
for separating concerns.


Poochie vs Mercury
---

Poochie and Mercury are similar in scope.  Both provide libraries and programming
techniques for defining testable, dynamic components in JavaScript.  Some
differences:

* Poochie does not use virtual DOM diffing.
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
