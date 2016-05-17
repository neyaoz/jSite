(function() {
    "use strict";

    jSite.md.extend({
        'moment': {
            onCompile: function(node) {
                var instance =
                    moment(jSite(node).data('parse'));

                jSite.each(jSite(node).data(), function(name, args) {
                    args = args || void 0;

                    if (jSite.isFunction(instance[name]))
                        instance = instance[name](args);
                });

                node.innerHTML = instance;
            },
            onDataChange: function(node) {
                this.md.onCompile.call(this.md, node);
            }
        },
        'duration': {
            onCompile: function(node) {
                var data = jSite(node).data(
                    ['seconds','minutes', 'hours', 'days', 'weeks', 'months', 'years']
                );
                node.innerHTML = moment.duration(data).humanize();
            },
            onDataChange: function(node) {
                this.md.onCompile.call(this.md, node);
            }
        }
    });
})();