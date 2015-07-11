//
// Discover unit tests, run them and log their output.
//

var fs = require('fs');

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

var files = fs.readdirSync(__dirname);
for (var i = 0; i < files.length; i++) {
    var filename = files[i];
    if (endsWith(filename, '_test.js')) {
        console.log('Testing ' + filename);
        console.log(require('./' + filename.slice(0, -3)));
    }
}
