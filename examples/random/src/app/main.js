(function() {
    "use strict";

    jSite.md.extend({
        
        'random': {
            node: null,
            data: { min: 0, max: 100 },
            rand: function() {
                jSite.extend(this.data, jSite(this.node).data());

                this.data.value = Math.round(Math.random() * (this.data.max - this.data.min)) + this.data.min;
                this.node.innerHTML = this.data.value;
            },
            onCompile: function(node) {
                this.node = node;
                this.rand();
            },
            onDataChange: function(node) {
                var data = jSite(node).data();

                if (data.min > this.data.value || this.data.value > data.max) {
                    this.rand();
                }
            }
        }
        
    });
})();