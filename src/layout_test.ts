import { deepEqual } from 'assert';
import { element, ReactiveElement } from './dom';
import { gap, hcat, vcat} from './layout';
import { publisher } from './observable';

describe('layout', () => {
    const eq = deepEqual;

    describe('#gap()', () => {
        it('should have the same width and height', () => {
            eq(gap(2).style, {width: '2px', height: '2px'});
        });
    });

    describe('#hcat()', () => {
        it('should create an empty div if given zero elements', () => {
            eq(hcat([]).name, 'div');
        });

        it('should have an array as its contents', () => {
            eq(hcat([]).contents instanceof Array, true);
        });
    });

    describe('#hcat() wraps with div', () => {
        const div = hcat([gap(1), gap(2)]);
        const g1 = div.contents[0];
        const g2 = div.contents[1];

        // g1 is a ReactiveElement
        it('should be of type ReactiveElement', () => {
            eq(g1 instanceof ReactiveElement, true);
        });

        it('should left-align contents by default', () => {
            eq(g1.style.cssFloat, 'left');
            eq(g1.style.clear, 'none');
            eq(g2.style.cssFloat, 'left');
            eq(g2.style.clear, 'none');
        });
    });

    describe('#hcat() with observable list', () => {
        const div = hcat({}, publisher([gap(1), gap(2)]));
        const g1 = div.contents.get()[0];

        it('should work with observable elements', () => {
            eq(g1.style.clear, 'none');
            eq(g1.style.clear, 'none');
        });
    });

    describe('#vcat()', () => {
        const div = vcat([gap(1), gap(2)]);
        const g1 = div.contents[0];
        const g2 = div.contents[1];

        it('should left-align contents by default', () => {
            eq(g1.style.cssFloat, 'left');
            eq(g1.style.clear, 'both');
            eq(g2.style.cssFloat, 'left');
            eq(g2.style.clear, 'both');
        });
    });

    // vcat can right-align elements
    describe('#vcat() can right-align', () => {
        const div = vcat({align: 'right'}, [gap(1), gap(2)]);
        const g1 = div.contents[0];
        const g2 = div.contents[1];
        it('should right-align contents if requested', () => {
            eq(g1.style.cssFloat, 'right');
            eq(g1.style.clear, 'both');
            eq(g2.style.cssFloat, 'right');
            eq(g2.style.clear, 'both');
        });
    });

    // vcat also accepts observable lists of elements.
    describe('#vcat() with observable list', () => {
        const div = vcat({}, publisher([gap(1), gap(2)]));
        const g1 = div.contents.get()[0];
        it('should work with observable elements', () => {
            eq(g1.style.cssFloat, 'left');
        });
    });

    describe('#vcat() unknown element size', () => {
        const br = element({name: 'br'});
        const div = vcat([br, br]);
        const b1 = div.contents[0];
        const b2 = div.contents[1];
        it('should work with unsized elements', () => {
            eq(b1.style.cssFloat, 'left');
            eq(b1.style.clear, 'both');
            eq(b2.style.cssFloat, 'left');
            eq(b2.style.clear, 'both');
        });
    });
});
