//
// Interface tests
//
// @ts-check
'use strict';

var layout = require('./layout');
var assert = require('assert');
var dom = require('./dom');
var observable = require('./observable');

var eq = assert.deepEqual;
var gap = layout.gap;
var hcat = layout.hcat;
var vcat = layout.vcat;

//
// gap
//
(function() {
    eq(gap(2).style, {width: '2px', height: '2px'});
})();

//
// hcat
//

(function testHCat() {
    // To concatenate zero elements will still create a div.
    eq(hcat([]).name, 'div');

    // hcat's contents is an array
    eq(hcat([]).contents instanceof Array, true);
})();

// hcat returns a new div for its input elements
(function testHCatNewDiv() {
    var div = hcat([gap(1), gap(2)]);
    var g1 = div.contents[0];
    var g2 = div.contents[1];

    // g1 is a ReactiveElement
    eq(g1 instanceof dom.ReactiveElement, true);

    eq(g1.style.cssFloat, 'left');
    eq(g1.style.clear, 'none');
    eq(g2.style.cssFloat, 'left');
    eq(g2.style.clear, 'none');
})();

// hcat also accepts observable lists of elements.
(function testHCatObservableList() {
    var div = hcat({}, observable.publisher([gap(1), gap(2)]));
    var g1 = div.contents.get()[0];
    eq(g1.style.clear, 'none');
    eq(g1.style.clear, 'none');
})();


//
// vcat
//

// vcat returns a new div containing its input elements
(function testVCat() {
    var div = vcat([gap(1), gap(2)]);
    var g1 = div.contents[0];
    var g2 = div.contents[1];
    eq(g1.style.cssFloat, 'left');
    eq(g1.style.clear, 'both');
    eq(g2.style.cssFloat, 'left');
    eq(g2.style.clear, 'both');
})();

// vcat can right-align elements
(function testVCatRightAlign() {
    var div = vcat({align: 'right'}, [gap(1), gap(2)]);
    var g1 = div.contents[0];
    var g2 = div.contents[1];
    eq(g1.style.cssFloat, 'right');
    eq(g1.style.clear, 'both');
    eq(g2.style.cssFloat, 'right');
    eq(g2.style.clear, 'both');
})();

// vcat also accepts observable lists of elements.
(function testVCatObservableList() {
    var div = vcat({}, observable.publisher([gap(1), gap(2)]));
    var g1 = div.contents.get()[0];
    eq(g1.style.cssFloat, 'left');
})();

// vcat doesn't require an element size is known upfront.
(function testVCatUnknownSize() {
    var br = dom.element({name: 'br'});
    var div = vcat([br, br]);
    var b1 = div.contents[0];
    var b2 = div.contents[1];
    eq(b1.style.cssFloat, 'left');
    eq(b1.style.clear, 'both');
    eq(b2.style.cssFloat, 'left');
    eq(b2.style.clear, 'both');
})();

module.exports = 'passed!';
