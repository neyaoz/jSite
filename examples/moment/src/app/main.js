(function() {
    "use strict";

    jSite.md.extend({

        'moment': {
            data: {},
            onCompile: function(node) {
                jSite.extend(this.data, jSite(node).data());

                this.moment = moment(this.data.parse);

                jSite.each(this.data, function(name, args) {
                    if (jSite.isFunction(this.moment[name])) {
                        this.moment = this.moment[name](args);
                    }
                }.bind(this));

                node.innerHTML = this.moment;
            },
            onDataChange: function(node) {
                this.onCompile(node);
            }
        },

        'duration': {
            data: {},
            onCompile: function(node) {
                jSite.extend(this.data, jSite(node).data());
                node.innerHTML = moment.duration(this.data).humanize();
            },
            onDataChange: function(node) {
                this.onCompile(node);
            }
        }
        
    });
})();