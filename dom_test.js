//
// Tests!
//

var dom = require('./dom');
var assert = require('assert');

//
// Test 'element' and 'clone'.
//
(function() {
    var e = dom.element({name: 'p', contents: 'hello'});
    assert.equal(e.name, 'p');
    assert.equal(e.contents, 'hello');
})();

module.exports = 'passed!';

