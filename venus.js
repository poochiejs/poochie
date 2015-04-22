var dom = require('./dom');
var observable = require('./observable');

// Render a ReactiveElement.  If it contains observables, poll it
// for updates.
function render(gizmo) {
    var nd = gizmo;
    if (typeof gizmo === 'string') {
        nd = document.createTextNode(gizmo);
    } else if (gizmo instanceof dom.ReactiveElement)  {
        nd = gizmo.render();
    }

    if (nd instanceof observable.Observable) {
        var obs = nd;
        setInterval(function(){obs.get();}, 30);
        nd = obs.get();
    }

    return nd;
}

module.exports = {
    render: render
};

