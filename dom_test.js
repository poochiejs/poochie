//
// Tests!
//

'use strict';

var dom = require('./dom');
var assert = require('assert');
var eq = assert.deepEqual;

//
// Test 'element' and 'render'.
//
(function() {
    var e = dom.element({name: 'br'});
    eq(e.name, 'br');
    eq(e.render().tagName, 'BR');

    // Pass element a string to create an element with the given tag name.
    eq(dom.element('br').name, 'br');

    // Pass createElement a string to create a DOM element with the given tag name.
    eq(dom.createElement('br').tagName, 'BR');
})();

//
// element with child nodes
//
(function() {
    var e = dom.element({name: 'p', contents: 'hello'});
    eq(e.contents, 'hello');

    // Pass contents a list to add multiple child nodes.
    eq(dom.element({name: 'p', contents: ['hello']}).render().childNodes[0].data, 'hello');

    // Child nodes can be vdom elements as well.
    eq(dom.element({name: 'p', contents: [dom.element('br')]}).render().childNodes[0].tagName, 'BR');
})();

//
// element with attributes
//
(function() {
    var e = dom.element({name: 'p', attributes: {id: 'foo'}, contents: 'bar'});
    eq(e.render().getAttribute('id'), 'foo');
})();

//
// element with style
//
(function() {
    var e = dom.element({name: 'p', style: {color: 'blue'}, contents: 'hello'});
    eq(e.render().style.color, 'blue');
})();

//
// element with an event handler
//
(function() {
    dom.element({name: 'p', handlers: {click: function() {}}}).render();
})();

//
// Test 'dom.render'.
//
(function() {
    var e = dom.element({name: 'p', contents: 'hello'});
    eq(dom.render(e).tagName, 'P');

    // Pass dom.createElement or dom.render a raw string to render a textNode.
    eq(dom.render('hello').data, 'hello');
})();

module.exports = 'passed!';
