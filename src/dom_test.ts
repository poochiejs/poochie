import { JSDOM } from 'jsdom';
let domObj = new JSDOM('');
global.document = domObj.window.document;

import * as dom from './dom';
import { deepEqual } from 'assert';
import { publisher } from './observable';

describe('dom', function() {
    let eq = deepEqual;

    describe('#element()', function() {
        it('should render to a DOM element', function() {
            let e = dom.element({name: 'br'});
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
            let e = dom.element({name: 'p', contents: 'hello'});
            eq(e.contents, 'hello');
        });

        it('should accept a list of vdom elements for its contents', function() {
            eq(dom.element({name: 'p', contents: [dom.element('br')]}).render().childNodes[0].tagName, 'BR');
        });

        it('should accept observables for its contents', function() {
            let o = publisher(['hello']);
            let e = dom.element({name: 'p', contents: o});
            let obj = dom.createElementAndSubscriber(e);
            eq(obj.element.childNodes[0].data, 'hello');

            o.set(['goodbye']);
            obj.subscriber.get();
            eq(obj.element.childNodes[0].data, 'goodbye');
        });

        it('should accept strings for attributes', function() {
            let e = dom.element({name: 'p', attributes: {id: 'foo'}, contents: 'bar'});
            eq(e.render().id, 'foo');
        });

        it('should accept observable attributes', function() {
            let o = publisher('foo');
            let e = dom.element({name: 'input', attributes: {value: o}});
            let obj = dom.createElementAndSubscriber(e);
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
            let e = dom.element({name: 'input', attributes: {value: undefined}});
            let obj = dom.createElementAndSubscriber(e);

            // Test that getAttribute does not return 'undefined';
            eq(obj.element.value, '');
        });

        it('should accept undefined observable attributes', function() {
            let o = publisher(undefined);
            let e = dom.element({name: 'input', attributes: {value: o}});
            let obj = dom.createElementAndSubscriber(e);

            // Test that getAttribute does not return 'undefined';
            eq(obj.element.value, '');
        });

        it('should setup DOM callbacks observable reaches createElement()', function(done) {
            this.timeout(100);
            let o = publisher('foo');
            let e = dom.element({name: 'input', attributes: {value: o}});
            let elem = dom.createElement(e);
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
            let e = dom.element({name: 'p', style: {color: 'blue'}, contents: 'hello'});
            eq(e.render().style.color, 'blue');
        });

        it('should accept a observable styles', function() {
            let o = publisher('hidden');
            let e = dom.element({name: 'p', style: {visible: o}});
            let obj = dom.createElementAndSubscriber(e);
            eq(obj.element.style.visible, 'hidden');

            o.set('visible');
            obj.subscriber.get();
            eq(obj.element.style.visible, 'visible');
        });

        it('should accept a undefined as a style', function() {
            let e = dom.element({name: 'p', style: {color: undefined}});
            eq(e.render().style.color, '');
        });

        it('should accept a handlers parameter for events', function() {
            dom.element({name: 'p', handlers: {click: function() {}}}).render();
        });
    });

    describe('#render()', function() {
        it('should render an object into a DOM element', function() {
            let e = dom.element({name: 'p', contents: 'hello'});
            eq(dom.render(e).tagName, 'P');
        });

        it('should render a string into a textNode', function() {
            eq(dom.render('hello').data, 'hello');
        });

        it('should render recursively so long as vdom elements are returned', function() {
            let e = dom.element({name: 'p', contents: 'hello'});
            let component = {render: function() {return e;}}
            eq(dom.render(component).tagName, 'P');
        });
    });

    describe('#element() with focus', function() {
        let o = publisher(false);
        let e = dom.element({name: 'p', focus: o, contents: 'hello'});

        it('should set blur and focus', function() {
            // Trigger blur()
            let obj = dom.createElementAndSubscriber(e);
            obj.subscriber.get();

            // Trigger focus()
            e.focus.set(true);
            obj.subscriber.get();
        });
    });
});
