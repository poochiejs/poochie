var JSDOM = require('jsdom').JSDOM;
var domObj = new JSDOM('');
global.document = domObj.window.document;

var dom = require('./dom');
var assert = require('assert');
var observable = require('./observable');
var eq = assert.deepEqual;

describe('dom', function() {

    describe('#element()', function() {
        it('should render to a DOM element', function() {
            var e = dom.element({name: 'br'});
            eq(e.name, 'br');
            eq(e.render().tagName, 'BR');
        });

        it('should be able to accept one string parameter, a name', function() {
            eq(dom.element('br').name, 'br');
        });

        it('should have the same interface as createElement', function() {
            eq(dom.createElement('br').tagName, 'BR');
        });

        it('should accept a string for its contents', function() {
            var e = dom.element({name: 'p', contents: 'hello'});
            eq(e.contents, 'hello');
        });

        it('should accept a list of vdom elements for its contents', function() {
            eq(dom.element({name: 'p', contents: [dom.element('br')]}).render().childNodes[0].tagName, 'BR');
        });

        it('should accept observables for its contents', function() {
            var o = observable.publisher(['hello']);
            var e = dom.element({name: 'p', contents: o});
            var obj = dom.createElementAndSubscriber(e);
            eq(obj.element.childNodes[0].data, 'hello');

            o.set(['goodbye']);
            obj.subscriber.get();
            eq(obj.element.childNodes[0].data, 'goodbye');
        });

        it('should accept strings for attributes', function() {
            var e = dom.element({name: 'p', attributes: {id: 'foo'}, contents: 'bar'});
            eq(e.render().id, 'foo');
        });

        it('should accept observable attributes', function() {
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
        });

        it('should accept undefined attributes', function() {
            var e = dom.element({name: 'input', attributes: {value: undefined}});
            var obj = dom.createElementAndSubscriber(e);

            // Test that getAttribute does not return 'undefined';
            eq(obj.element.value, '');
        });

        it('should accept undefined observable attributes', function() {
            var o = observable.publisher(undefined);
            var e = dom.element({name: 'input', attributes: {value: o}});
            var obj = dom.createElementAndSubscriber(e);

            // Test that getAttribute does not return 'undefined';
            eq(obj.element.value, '');
        });

        it('should setup DOM callbacks observable reaches createElement()', function(done) {
            this.timeout(100);
            var o = observable.publisher('foo');
            var e = dom.element({name: 'input', attributes: {value: o}});
            var elem = dom.createElement(e);
            eq(elem.value, 'foo');

            function checkAttr() {
                eq(elem.value, 'bar');
                dom.clearIntervalTimers();
                done();
            }

            o.set('bar');
            setTimeout(checkAttr, 30);
        });

        it('should accept a style parameter', function() {
            var e = dom.element({name: 'p', style: {color: 'blue'}, contents: 'hello'});
            eq(e.render().style.color, 'blue');
        });

        it('should accept a observable styles', function() {
            var o = observable.publisher('hidden');
            var e = dom.element({name: 'p', style: {visible: o}});
            var obj = dom.createElementAndSubscriber(e);
            eq(obj.element.style.visible, 'hidden');

            o.set('visible');
            obj.subscriber.get();
            eq(obj.element.style.visible, 'visible');
        });

        it('should accept a undefined as a style', function() {
            var e = dom.element({name: 'p', style: {color: undefined}});
            eq(e.render().style.color, '');
        });

        it('should accept a handlers parameter for events', function() {
            dom.element({name: 'p', handlers: {click: function() {}}}).render();
        });
    });

    describe('#render()', function() {
        it('should render an object into a DOM element', function() {
            var e = dom.element({name: 'p', contents: 'hello'});
            eq(dom.render(e).tagName, 'P');
        });

        it('should render a string into a textNode', function() {
            eq(dom.render('hello').data, 'hello');
        });

        it('should render recursively so long as vdom elements are returned', function() {
            var e = dom.element({name: 'p', contents: 'hello'});
            var component = {render: function() {return e;}}
            eq(dom.render(component).tagName, 'P');
        });
    });

    describe('#element() with focus', function() {
        var o = observable.publisher(false);
        var e = dom.element({name: 'p', focus: o, contents: 'hello'});

        it('should set blur and focus', function() {
            // Trigger blur()
            var obj = dom.createElementAndSubscriber(e);
            obj.subscriber.get();

            // Trigger focus()
            e.focus.set(true);
            obj.subscriber.get();
        });
    });

});
