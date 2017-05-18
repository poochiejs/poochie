//
// Tests!
//

'use strict';

var JSDOM = require('jsdom').JSDOM;
var domObj = new JSDOM('');
global.document = domObj.window.document;

var dom = require('./dom');
var assert = require('assert');
var observable = require('./observable');
var eq = assert.deepEqual;

//
// Test 'element' and 'render'.
//
(function testElement() {
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
(function testElementWithChildNodes() {
    var e = dom.element({name: 'p', contents: 'hello'});
    eq(e.contents, 'hello');

    // Pass contents a list to add multiple child nodes.
    eq(dom.element({name: 'p', contents: ['hello']}).render().childNodes[0].data, 'hello');

    // Child nodes can be vdom elements as well.
    eq(dom.element({name: 'p', contents: [dom.element('br')]}).render().childNodes[0].tagName, 'BR');
})();

//
// element with observable child nodes
//
(function testObservableChildNodes() {
    var o = observable.publisher(['hello']);
    var e = dom.element({name: 'p', contents: o});
    var obj = dom.createElementAndSubscriber(e);
    eq(obj.element.childNodes[0].data, 'hello');

    o.set(['goodbye']);
    obj.subscriber.get();
    eq(obj.element.childNodes[0].data, 'goodbye');
})();

//
// element with attributes
//
(function testAttributes() {
    var e = dom.element({name: 'p', attributes: {id: 'foo'}, contents: 'bar'});
    eq(e.render().id, 'foo');
})();

//
// element with observable attribute
//
(function testObservableAttributes() {
    var o = observable.publisher('foo');
    var e = dom.element({name: 'input', attributes: {value: o}});
    var obj = dom.createElementAndSubscriber(e);
    eq(obj.element.value, 'foo');

    o.set('bar');
    obj.subscriber.get();
    eq(obj.element.value, 'bar');

    o.set(undefined);
    obj.subscriber.get();

    // TODO: Why is "delete e[k]" being ignored by jsdom?
    //eq('value' in obj.element, false);
})();

//
// element with undefined attributes
//
(function testUndefinedAttributes() {
    var e = dom.element({name: 'input', attributes: {value: undefined}});
    var obj = dom.createElementAndSubscriber(e);

    // Test that getAttribute does not return 'undefined';
    eq(obj.element.value, '');
})();

//
// element with undefined observable attribute
//
(function testUndefinedObservableAttributes() {
    var o = observable.publisher(undefined);
    var e = dom.element({name: 'input', attributes: {value: o}});
    var obj = dom.createElementAndSubscriber(e);

    // Test that getAttribute does not return 'undefined';
    eq(obj.element.value, '');
})();

//
// createElement with observable attribute
// This is the same as the test above, but using createElement(), which
// sets up a timer to monitor any observables.
//
(function testCreateElement() {
    var o = observable.publisher('foo');
    var e = dom.element({name: 'input', attributes: {value: o}});
    var elem = dom.createElement(e);
    eq(elem.value, 'foo');

    function checkAttr() {
        eq(elem.value, 'bar');
        dom.clearIntervalTimers();
    }

    o.set('bar');
    setTimeout(checkAttr, 30);
})();


//
// element with style
//
(function testStyle() {
    var e = dom.element({name: 'p', style: {color: 'blue'}, contents: 'hello'});
    eq(e.render().style.color, 'blue');
})();

//
// element with observable style
//
(function testObservableStyle() {
    var o = observable.publisher('hidden');
    var e = dom.element({name: 'p', style: {visible: o}});
    var obj = dom.createElementAndSubscriber(e);
    eq(obj.element.style.visible, 'hidden');

    o.set('visible');
    obj.subscriber.get();
    eq(obj.element.style.visible, 'visible');
})();

//
// element with undefined style
//
(function testUndefinedStyle() {
    var e = dom.element({name: 'p', style: {color: undefined}});
    eq(e.render().style.color, '');
})();

//
// element with an event handler
//
(function testHandlers() {
    dom.element({name: 'p', handlers: {click: function() {}}}).render();
})();

//
// Test 'dom.render'.
//
(function testRender() {
    var e = dom.element({name: 'p', contents: 'hello'});
    eq(dom.render(e).tagName, 'P');

    // Pass dom.createElement or dom.render a raw string to render a textNode.
    eq(dom.render('hello').data, 'hello');
})();

//
// Test recursive render.
//
(function testRenderRender() {
    var e = dom.element({name: 'p', contents: 'hello'});
    var component = {render: function() {return e;}}
    eq(dom.render(component).tagName, 'P');
})();

//
// Test setting focus
//
(function testFocus() {
    var o = observable.publisher(false);
    var e = dom.element({name: 'p', focus: o, contents: 'hello'});

    // Trigger blur()
    var obj = dom.createElementAndSubscriber(e);
    obj.subscriber.get();

    // Trigger focus()
    e.focus.set(true);
    obj.subscriber.get();
})();

module.exports = 'passed!';
