(function() {
    "use strict";

    jSite.md.extend({

        'moment': {
            prototype: {
                onCompile: function(node, data, module) {
                    var m = moment(this.data.parse);

                    jSite.each(this.data, function(name, args) {
                        if (jSite.isFunction(m[name])) {
                            m = m[name](args);
                        }
                    });

                    this.node.innerHTML = m;
                },
                onDataChange: function(node, name, data) {
                    this.onCompile();
                }
            }
        },

        'duration': {
            prototype: {
                onCompile: function(node, data, module) {
                    this.node.innerHTML = moment.duration(this.data).humanize();
                },
                onDataChange: function(node, name, data) {
                    this.onCompile();
                }
            }
        }
        
    });
})();