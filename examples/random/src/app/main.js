(function() {
    "use strict";

    jSite.md.extend({
        'random': {
            onCompile: function(node) {
                this.node = node;
                this.data = { min: 0, max: 100};
                this.rand = function(data) {
                    jSite.extend(this.data, data || []);

                    this.value = Math.round(Math.random() * (this.data.max - this.data.min)) + this.data.min;
                    node.innerHTML = this.value;
                };

                this.rand(jSite(node).data());
            },
            onDataChange: function(node) {

                var data = jSite(node).data();

                if (data.min > this.value || this.value > data.max) {
                    this.rand(data);
                }
            }
        }
    });
})();