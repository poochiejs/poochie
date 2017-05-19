import { gap, hcat, vcat} from './layout';
import { deepEqual } from 'assert';
import { ReactiveElement, element } from './dom';
import { publisher } from './observable';

describe('layout', function() {
    let eq = deepEqual;

    describe('#gap()', function() {
        it('should have the same width and height', function() {
            eq(gap(2).style, {width: '2px', height: '2px'});
        });
    });

    describe('#hcat()', function() {
        it('should create an empty div if given zero elements', function() {
            eq(hcat([]).name, 'div');
        });

        it('should have an array as its contents', function() {
            eq(hcat([]).contents instanceof Array, true);
        });
    });

    describe('#hcat() wraps with div', function() {
        let div = hcat([gap(1), gap(2)]);
        let g1 = div.contents[0];
        let g2 = div.contents[1];

        // g1 is a ReactiveElement
        it('should be of type ReactiveElement', function() {
            eq(g1 instanceof ReactiveElement, true);
        });

        it('should left-align contents by default', function() {
            eq(g1.style.cssFloat, 'left');
            eq(g1.style.clear, 'none');
            eq(g2.style.cssFloat, 'left');
            eq(g2.style.clear, 'none');
        });
    });

    describe('#hcat() with observable list', function() {
        let div = hcat({}, publisher([gap(1), gap(2)]));
        let g1 = div.contents.get()[0];

        it('should work with observable elements', function() {
            eq(g1.style.clear, 'none');
            eq(g1.style.clear, 'none');
        });
    });

    describe('#vcat()', function() {
        let div = vcat([gap(1), gap(2)]);
        let g1 = div.contents[0];
        let g2 = div.contents[1];

        it('should left-align contents by default', function() {
            eq(g1.style.cssFloat, 'left');
            eq(g1.style.clear, 'both');
            eq(g2.style.cssFloat, 'left');
            eq(g2.style.clear, 'both');
        });
    });

    // vcat can right-align elements
    describe('#vcat() can right-align', function() {
        let div = vcat({align: 'right'}, [gap(1), gap(2)]);
        let g1 = div.contents[0];
        let g2 = div.contents[1];
        it('should right-align contents if requested', function() {
            eq(g1.style.cssFloat, 'right');
            eq(g1.style.clear, 'both');
            eq(g2.style.cssFloat, 'right');
            eq(g2.style.clear, 'both');
        });
    });

    // vcat also accepts observable lists of elements.
    describe('#vcat() with observable list', function() {
        let div = vcat({}, publisher([gap(1), gap(2)]));
        let g1 = div.contents.get()[0];
        it('should work with observable elements', function() {
            eq(g1.style.cssFloat, 'left');
        });
    });

    describe('#vcat() unknown element size', function() {
        let br = element({name: 'br'});
        let div = vcat([br, br]);
        let b1 = div.contents[0];
        let b2 = div.contents[1];
        it('should work with unsized elements', function() {
            eq(b1.style.cssFloat, 'left');
            eq(b1.style.clear, 'both');
            eq(b2.style.cssFloat, 'left');
            eq(b2.style.clear, 'both');
        });
    });
});
