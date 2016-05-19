(function() {
    "use strict";

    jSite.md.extend({
        
        'random': {
            counter: 0,
            data: {
                min: 0,
                max: 100
            },
            prototype: {
                rand: function() {
                    this.static.counter++;
                    this.data.value = Math.round(Math.random() * (this.data.max - this.data.min)) + this.data.min;
                    this.node.innerHTML = this.data.value;
                },
                onCompile: function(node, data, module) {
                    this.rand();
                },
                onDataChange: function(node, name, data) {
                    if (this.data.min > this.data.value || this.data.value > this.data.max) {
                        this.rand();
                    }
                }
            }
        }
        
    });
})();