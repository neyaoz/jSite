(function() {
    "use strict";

    jSite.md.extend({
        'moment': {
            bind: function() {
                var node = this.node;

                var instance =
                    moment(jSite(node).options('parse'));

                jSite.each(jSite(node).options(), function(name, args) {
                    args = args || void 0;

                    if (jSite.isFunction(instance[name]))
                        instance = instance[name](args);
                });

                this.node.innerHTML = instance;
            }
        },
        'duration': {
            bind: function() {
                var options = jSite(this.node).options(
                    ['seconds','minutes', 'hours', 'days', 'weeks', 'months', 'years']
                );
                this.node.innerHTML = moment.duration(options).humanize();
            }
        }
    });
})();