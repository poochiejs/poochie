var layout = require('./layout');
var assert = require('assert');
var dom = require('./dom');
var observable = require('./observable');

var eq = assert.deepEqual;
var gap = layout.gap;
var hcat = layout.hcat;
var vcat = layout.vcat;

describe('layout', function() {

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
        var div = hcat([gap(1), gap(2)]);
        var g1 = div.contents[0];
        var g2 = div.contents[1];

        // g1 is a ReactiveElement
        it('should be of type ReactiveElement', function() {
            eq(g1 instanceof dom.ReactiveElement, true);
        });

        it('should left-align contents by default', function() {
            eq(g1.style.cssFloat, 'left');
            eq(g1.style.clear, 'none');
            eq(g2.style.cssFloat, 'left');
            eq(g2.style.clear, 'none');
        });
    });

    describe('#hcat() with observable list', function() {
        var div = hcat({}, observable.publisher([gap(1), gap(2)]));
        var g1 = div.contents.get()[0];

        it('should work with observable elements', function() {
            eq(g1.style.clear, 'none');
            eq(g1.style.clear, 'none');
        });
    });

    describe('#vcat()', function() {
        var div = vcat([gap(1), gap(2)]);
        var g1 = div.contents[0];
        var g2 = div.contents[1];

        it('should left-align contents by default', function() {
            eq(g1.style.cssFloat, 'left');
            eq(g1.style.clear, 'both');
            eq(g2.style.cssFloat, 'left');
            eq(g2.style.clear, 'both');
        });
    });

    // vcat can right-align elements
    describe('#vcat() can right-align', function() {
        var div = vcat({align: 'right'}, [gap(1), gap(2)]);
        var g1 = div.contents[0];
        var g2 = div.contents[1];
        it('should right-align contents if requested', function() {
            eq(g1.style.cssFloat, 'right');
            eq(g1.style.clear, 'both');
            eq(g2.style.cssFloat, 'right');
            eq(g2.style.clear, 'both');
        });
    });

    // vcat also accepts observable lists of elements.
    describe('#vcat() with observable list', function() {
        var div = vcat({}, observable.publisher([gap(1), gap(2)]));
        var g1 = div.contents.get()[0];
        it('should work with observable elements', function() {
            eq(g1.style.cssFloat, 'left');
        });
    });

    describe('#vcat() unknown element size', function() {
        var br = dom.element({name: 'br'});
        var div = vcat([br, br]);
        var b1 = div.contents[0];
        var b2 = div.contents[1];
        it('should work with unsized elements', function() {
            eq(b1.style.cssFloat, 'left');
            eq(b1.style.clear, 'both');
            eq(b2.style.cssFloat, 'left');
            eq(b2.style.clear, 'both');
        });
    });
});
