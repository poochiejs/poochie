import { JSDOM } from 'jsdom';
const domObj = new JSDOM('');
global.document = domObj.window.document;

import { deepEqual } from 'assert';
import * as dom from './dom';
import { publisher } from './observable';

describe('dom', () => {
    const eq = deepEqual;

    describe('#element()', () => {
        it('should render to a DOM element', () => {
            const e = dom.element({name: 'br'});
            eq(e.name, 'br');
            eq(e.render().tagName, 'BR');
        });

        it('should be able to accept one string parameter, a name', () => {
            eq(dom.element('br').name, 'br');
        });

        it('should have the same interface as createElement', () => {
            eq(dom.createElement('br').tagName, 'BR');
        });

        it('should accept a string for its contents', () => {
            const e = dom.element({name: 'p', contents: 'hello'});
            eq(e.contents, 'hello');
        });

        it('should accept a list of vdom elements for its contents', () => {
            eq(dom.element({name: 'p', contents: [dom.element('br')]}).render().childNodes[0].tagName, 'BR');
        });

        it('should accept observables for its contents', () => {
            const o = publisher(['hello']);
            const e = dom.element({name: 'p', contents: o});
            const obj = dom.createElementAndSubscriber(e);
            eq(obj.element.childNodes[0].data, 'hello');

            o.set(['goodbye']);
            obj.subscriber.get();
            eq(obj.element.childNodes[0].data, 'goodbye');
        });

        it('should accept strings for attributes', () => {
            const e = dom.element({name: 'p', attributes: {id: 'foo'}, contents: 'bar'});
            eq(e.render().id, 'foo');
        });

        it('should accept observable attributes', () => {
            const o = publisher('foo');
            const e = dom.element({name: 'input', attributes: {value: o}});
            const obj = dom.createElementAndSubscriber(e);
            eq(obj.element.value, 'foo');

            o.set('bar');
            obj.subscriber.get();
            eq(obj.element.value, 'bar');

            o.set(undefined);
            obj.subscriber.get();

            // TODO: Why is "delete e[k]" being ignored by jsdom?
            // eq('value' in obj.element, false);
        });

        it('should accept undefined attributes', () => {
            const e = dom.element({name: 'input', attributes: {value: undefined}});
            const obj = dom.createElementAndSubscriber(e);

            // Test that getAttribute does not return 'undefined';
            eq(obj.element.value, '');
        });

        it('should accept undefined observable attributes', () => {
            const o = publisher(undefined);
            const e = dom.element({name: 'input', attributes: {value: o}});
            const obj = dom.createElementAndSubscriber(e);

            // Test that getAttribute does not return 'undefined';
            eq(obj.element.value, '');
        });

        it('should setup DOM callbacks', function(done) {
              this.timeout(100);
              const o = publisher('foo');
              const e = dom.element({name: 'input', attributes: {value: o}});
              const elem = dom.createElement(e);
              eq(elem.value, 'foo');

              function checkAttr() {
                  eq(elem.value, 'bar');
                  dom.clearIntervalTimers();
                  done();
              }

              o.set('bar');
              setTimeout(checkAttr, 30);
        });

        it('should accept a style parameter', () => {
            const e = dom.element({name: 'p', style: {color: 'blue'}, contents: 'hello'});
            eq(e.render().style.color, 'blue');
        });

        it('should accept a observable styles', () => {
            const o = publisher('hidden');
            const e = dom.element({name: 'p', style: {visible: o}});
            const obj = dom.createElementAndSubscriber(e);
            eq(obj.element.style.visible, 'hidden');

            o.set('visible');
            obj.subscriber.get();
            eq(obj.element.style.visible, 'visible');
        });

        it('should accept a undefined as a style', () => {
            const e = dom.element({name: 'p', style: {color: undefined}});
            eq(e.render().style.color, '');
        });

        it('should accept a handlers parameter for events', () => {
            dom.element({name: 'p', handlers: {click: () => undefined}}).render();
        });
    });

    describe('#render()', () => {
        it('should render an object into a DOM element', () => {
            const e = dom.element({name: 'p', contents: 'hello'});
            eq(dom.render(e).tagName, 'P');
        });

        it('should render a string into a textNode', () => {
            eq(dom.render('hello').data, 'hello');
        });

        it('should render recursively so long as vdom elements are returned', () => {
            const e = dom.element({name: 'p', contents: 'hello'});
            const component = {render: () => e};
            eq(dom.render(component).tagName, 'P');
        });
    });

    describe('#element() with focus', () => {
        const o = publisher(false);
        const e = dom.element({name: 'p', focus: o, contents: 'hello'});

        it('should set blur and focus', () => {
            // Trigger blur()
            const obj = dom.createElementAndSubscriber(e);
            obj.subscriber.get();

            // Trigger focus()
            e.focus.set(true);
            obj.subscriber.get();
        });
    });
});
