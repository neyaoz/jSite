(function() {
    "use strict";

    jSite.md.extend({
        'random': {
            bind: function() {
                var node = this.node;

                var options = jSite.extend({
                    min: 0,
                    max: 100
                }, jSite(node).options());

                jSite.extend({min: 0, max: 100}, jSite(node).options(), {min: 1000});

                node.innerHTML = Math.round(Math.random() * (options.max - options.min)) + options.min
            }
        }
    });
})();