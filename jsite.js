(function(global, factory) {

    if (typeof module === "object" && typeof module.exports === "object") {
        // For CommonJS and CommonJS-like environments where a proper `window`
        // is present, execute the factory and get jSite.
        // For environments that do not have a `window` with a `document`
        // (such as Node.js), expose a factory as module.exports.
        // This accentuates the need for the creation of a real `window`.
        // e.g. var jSite = require("jSite")(window);
        module.exports =
            global.document ?
                factory(global, true) :
                function(w) {
                    if (!w.document) {
                        throw new Error("jSite requires a window with a document");
                    }
                    return factory(w);
                };
    } else {
        factory(global);
    }

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function(window, noGlobal) {
    "use strict";

    // Define a local copy of jSite
    var jSite =
        function(cluster, context) {
            // The jSite object is actually just the init constructor 'enhanced'
            // Need init if jSite is called (just allow error to be thrown if not included)
            return new jSite.fn.init(cluster, context);
        };


    jSite.fn =
        jSite.prototype = {
            version: '0.1.0-alpha.4',
            constructor: jSite,
            context: document,
            length: 0,

            get: function(i) {
                return i !== null ?
                    // Return just the one element from the set
                    (i < 0 ? this[i + this.length] : this[i]) :
                    // Return all the elements in a clean array
                    this.toArray();
            },
            each: function(callback, args) {
                return jSite.each(this, callback, args);
            },
            toArray: function() {
                return [].slice.call(this);
            },

            // For internal use only.
            // Behaves like an Array's method, not like a jSite method.
            push  : [].push,
            sort  : [].sort,
            splice: [].splice
        };


    jSite.fn.init = function(cluster, context) {
        var root = this;

        if (jSite.isElement(context) || jSite.isDocument(context)) {
            root.context = context;
        }

        var pushStack;
        jSite.each([cluster], pushStack = function(i, node) {
            if (jSite.isString(node)) {
                node = root.context.querySelectorAll(node);
            }

            if (jSite.isElement(node) || jSite.isDocument(node) || jSite.isWindow(node)) {
                jSite.inArray(root, node) || root.push(node);
            } else if (jSite.isFunction(node)) {
                jSite.ready(node);
            } else if (jSite.isArrayLike(node)) {
                jSite.each(node, pushStack);
            }
        });

        return this;
    };
    jSite.fn.init.prototype = jSite.fn;


    jSite.extend =
        jSite.fn.extend = function() {
            var cluster = [].slice.call(arguments);

            var isDeep = false;
            if (typeof cluster[0] === 'boolean') {
                isDeep = cluster.shift();
            }

            var target = this;
            if (cluster.length > 1) {
                target = cluster.shift();

                if (typeof target !== 'object' && typeof target !== 'function') {
                    target = {};
                }
            }

            var object;
            for (var i = 0; i < cluster.length; i++) {
                if (typeof (object = cluster[i]) === 'object') {
                    for (var k in object) {
                        if (!object.hasOwnProperty(k) || object[k] === target) {
                            continue;
                        }

                        var value = target[k];
                        var clone = object[k], isArrayClone;

                        if (isDeep && ((isArrayClone = jSite.isArray(clone)) || jSite.isPlain(clone))) {
                            if (isArrayClone) {
                                jSite.isArray(value) || (value = []);
                            } else {
                                jSite.isPlain(value) || jSite.isFunction(value) || jSite.fn === value || (value = {});
                            }

                            target[k] = jSite.extend(isDeep, value, clone);
                        } else if(typeof clone !== 'undefined') {
                            target[k] = clone;
                        }
                    }
                }
            }

            return target;
        };


    jSite.extend({
        isReady: null,
        ready: function(callback) {
            if (jSite.isReady) {
                callback.call(window, jSite);
            } else {
                jSite.ready.items = jSite.ready.items || [];
                jSite.ready.items.push(callback);
                jSite.ready.check();
            }
        }
    });
    jSite.ready.start = function() {
        if (jSite.isReady !== true) {
            jSite.isReady   = true;
            jSite.each(jSite.ready.items, function() {
                this.call(window, jSite);
            });
        }
    };
    jSite.ready.check = function() {
        if (document.readyState === 'complete' || (!document.attachEvent && document.readyState === 'interactive')) {
            jSite.ready.start();
            return;
        }

        if (jSite.isReady === null) {
            jSite.isReady   =  !!0;

            if (document.addEventListener) {
                document.addEventListener('DOMContentLoaded', jSite.ready.start, false);
                window.addEventListener('load', jSite.ready.start, false);
            } else {
                document.attachEvent('onreadystatechange', function() {
                    if (document.readyState === 'complete') {
                        jSite.ready.start();
                    }
                });
                window.attachEvent('onload', jSite.ready.start);
            }
        }
    };


    jSite.extend({
        type: function(obj) {
            var type;

            if (typeof obj === 'object' || typeof obj === 'function') {
                type = {}.toString.call(obj).toLowerCase().match(/^\[object\s+([a-z]+)]$/);
                type = type ? type[1] : 'object';
            } else {
                type = typeof obj;
            }

            return type;
        },
        isString: function(obj) {
            return jSite.type(obj) === 'string';
        },
        isNumeric: function(obj) {
            return !jSite.isArray(obj) &&
                (obj - parseFloat(obj) + 1) >= 0;
        },
        isObject: function(obj) {
            return typeof obj === 'object';
        },
        isPlain: function(obj) {
            return jSite.type(obj) === 'object'
                && !(obj.constructor
                && !{}.hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf"));
        },
        isPlainObject: function(obj) {
            return jSite.isPlain(obj);
        },
        isArray: Array.isArray,
        inArray: function(obj, value) {
            if (jSite.isArrayLike(obj))
                for (var i = 0; i < obj.length; i++)
                    if (obj[i] === value)
                        return true;
            return false;
        },
        toArray: function(obj, start, end) {
            return Array.prototype.slice.call(obj, start, end);
        },
        isArrayLike: function(obj) {
            if (obj && jSite.isObject(obj))
                return jSite.isArray(obj) || obj.length === 0 || typeof obj.length === "number" && obj.length > 0 && (obj.length-1) in obj;
            return false;
        },
        isElement: function(obj) {
            return obj && obj.nodeType === 1;
        },
        isDocument: function(obj) {
            return obj && obj.nodeType === 9;
        },
        isWindow: function(obj) {
            return obj && obj === obj.window;
        },
        isFunction: function(obj) {
            return jSite.type(obj) === 'function';
        },
        isEmpty: function(obj) {
            if (jSite.isUndefined(obj) || jSite.isNull(obj)) return true;
            if (jSite.isNumeric(obj)) return obj === 0;
            if (jSite.isArray(obj) || jSite.isString(obj)) return obj.length === 0;
            for (var i in obj) if (obj.hasOwnProperty(i)) return false;
            return true;
        },
        isNull: function(obj) {
            return obj === null;
        },
        isDefined: function(obj) {
            return obj !== void 0;
        },
        isUndefined: function(obj) {
            return !jSite.isDefined(obj)
        }
    });


    jSite.extend({
        error: function(message) {
            throw new Error(message);
        },
        merge: function() {
            var target = arguments[0] || [];
            jSite.each([].slice.call(arguments, 1), function(i, obj) {
                if (jSite.isArrayLike(obj)) {
                    for (var j = 0; j < obj.length; j++) {
                        [].push.call(target, obj[j]);
                    }
                }
            });
            return target;
        },
        each: function(obj, callback, args) {
            var i;
            if (jSite.isArrayLike(obj)) {
                for (i = 0; i < obj.length; i++)
                    if (callback.apply(obj[i], args || [i, obj[i], obj]) === false)
                        break;
            } else {
                for (i in obj)
                    if (obj.hasOwnProperty(i))
                        if (callback.apply(obj[i], args || [i, obj[i], obj]) === false)
                            break;
            }

            // TODO results[] support will be added
            return obj;
        }
    });


    jSite.extend({
        parseData: function(obj) {
            if (typeof obj === 'string') {
                try {
                    obj =
                        obj === 'undefined' ? undefined :  obj === 'null' ? null :
                        obj === 'true' ? true : obj === 'false' ? false :
                        obj === +obj + '' ? +obj :
                        JSON.parse(obj);
                } catch(e) {}
            }

            return obj;
        },
        setData: function(obj, path, value) {
            if (jSite.isString(path)) {
                path = path.split('.');
            }

            var ref = obj;

            for (var i = 0; i < path.length; i++)
            {
                if (i !== path.length - 1) {
                    ref = (ref[path[i]] = ref.hasOwnProperty(path[i]) ? ref[path[i]] : {});
                } else {
                    ref = (ref[path[i]] = value);
                }
            }

            return obj;
        },
        getData: function(obj, path) {
            if (jSite.isUndefined(obj) || jSite.isUndefined(path)) {
                return obj;
            }

            if (jSite.isString(path)) {
                path = path.split('.');
            }

            for (var i = 0; i < path.length; i++) {
                if (obj.hasOwnProperty(path[i])) {
                    obj = obj[path[i]];
                    continue;
                }
                obj = void 0;
                break;
            }

            return obj;
        },
        getOnly: function(obj, keys, except) {
            if (jSite.isUndefined(keys)) {
                return obj;
            }

            var returnFirst = false;
            if (!jSite.isArray(keys)) {
                keys = [keys];
                returnFirst = !except;
            }

            var target = {};
            for (var i in obj) {
                if (obj.hasOwnProperty(i) && jSite.inArray(keys, i) === !except)
                    target[i] = obj[i];
            }

            if (returnFirst) {
                for (i in target)
                    if (target.hasOwnProperty(i))
                        return target[i];
                return void 0;
            }

            return target;
        },
        invertKeys: function(obj) {
            var target = {};

            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    target[obj[i]] = i;
                }
            }

            return target;
        },
        camelCase: function(str) {
            return str.replace(/(--)|(?:-)([a-z])/g, function(match, $1, $2) {
                if (jSite.isDefined($1)) {
                    return '-';
                }
                return $2.toUpperCase();
            });
        }
    });


    jSite.fn.extend({
        data: function(only, except) {
            var data = {};

            jSite.each(this.get(0).attributes, function(i, attribute, match) {
                if (match = attribute.name.match(/^j-data-([_.:-a-z0-9]+)/i)) {
                    jSite.setData(data, jSite.camelCase(match[1]), jSite.parseData(attribute.value))
                }
            });

            return jSite.getOnly(data, only, except);
        }
    });

    jSite.extend(true, {
        md: {
            all: {},
            observer: null,
            init: function() {
                var that = this;

                jSite.ready(function() {
                    that.observer = new MutationObserver(function(mutations) {
                        mutations.forEach(function(mutation) {
                            var targetNode = mutation.target;
                            var addedNodes = Array.prototype.slice.call(mutation.addedNodes);

                            if (mutation.type === 'childList') {
                                addedNodes.forEach(function(node) {
                                    if (jSite.isElement(node)) {
                                        that.bindNode(node);
                                    }
                                });
                            }

                            if (mutation.type === 'attributes' && targetNode.module) {
                                var match;
                                if (match = mutation.attributeName.match(/^j-data-([_.:-a-z0-9]+)/i)) {
                                    var name = jSite.camelCase(match[1]);
                                    var data = jSite(targetNode).data(name);

                                    that.dataChange(targetNode, name, data);
                                }
                            }
                        });
                    });

                    that.observer.observe(document, {
                        attributes: true,
                        characterData: true,
                        childList: true,
                        subtree: true
                    });
                });
            },
            ready: function (callback) {
                jSite.ready(callback.bind(this));
            },
            registerAll: function() {
                this.each(function(name) {
                    this.register(name);
                });

                this.ready(function() {
                    this.bindContext();
                });
            },
            register: function(name, force) {
                var module = this.get(name);

                if (module.isRegistered && force !== true) {
                    return;
                }

                module.onRegister();
                module.isRegistered = true;

                if (! module.isDeferred) {
                    this.ready(function() {
                        this.boot(name);
                    });
                }
            },
            boot: function(name, force) {
                var module = this.get(name);

                if (module.isBooted && force !== true) {
                    return;
                }

                module.onBoot();
                module.isBooted = true;
            },
            bindContext: function(context, force) {
                var that = this;
                jSite('*', context).each(function() {
                    that.bindNode(this, force);
                });
            },
            bindNode: function(node, force) {
                var name =
                    node.attributes['j-bind']
                        ? node.attributes['j-bind'].value
                        : node.tagName.toLowerCase();

                if (this.has(name)) {
                    this.bind(node, name, force);
                }
            },
            bind: function(node, name, force) {
                var module = this.get(name);

                if (node.module && node.module.isCompiled && force !== true) {
                    return;
                }

                if (module.isDeferred) {
                    this.boot(name);
                }

                node.module = Object.create(
                    module.prototype,
                    {
                        node: {
                            value: node
                        },
                        data: {
                            value: jSite.extend(true, {}, {}, module.data, jSite(node).data())
                        }
                    }
                );

                node.module.onBind(node, node.module.data, node.module.static);
                node.module.isBinded = true;
            },
            dataChange: function(node, name, data) {
                var module = node.module;

                jSite.setData(module.data, name, data);
                module.onDataChange(node, name, data);
            },
            extend: function() {
                var that = this;
                var modules = jSite.extend.apply(
                    {}, jSite.toArray(arguments)
                );

                jSite.each(modules, function(name, module) {
                    that.put(name, that.create(module));
                });

                this.registerAll();
                return this.all;
            },
            create: function(module) {
                module =
                    jSite.extend(
                        true,
                        {
                            data: {},
                            isDeferred: false,
                            isRegistered: false,
                            isBooted: false,
                            onRegister: function() {},
                            onBoot: function() {},

                            prototype:
                            {
                                data: {},
                                node: null,
                                isBinded: false,
                                onBind: function() {},
                                onDataChange: function() {}
                            }
                        },
                        module
                    );
                module.prototype.static = module;

                return module;
            },
            put: function(name, module) {
                return this.all[name] = module;
            },
            get: function(name) {
                this.has(name, true);
                return this.all[name];
            },
            has: function(name, throwable) {
                if (this.all.hasOwnProperty(name)) {
                    return true;
                }
                if (throwable === true) {
                    jSite.error('jSite does not contain a module named <' + name + '>');
                }
                return false;
            },
            each: function(callback) {
                return jSite.each(this.all, callback.bind(this));
            }
        },
        fn: {
            md: function(name, force) {
                return this.each(function () {
                    if (name) {
                        jSite.md.bind(this, name, force);
                    } else {
                        jSite.md.bindNode(this, force);
                    }
                }, arguments)
            }
        }
    });
    jSite.md.init();


    // Register as a named AMD module, since jSite can be concatenated with other
    // files that may use define, but not via a proper concatenation script that
    // understands anonymous AMD modules. A named AMD is safest and most robust
    // way to register. Lowercase jSite is used because AMD module names are
    // derived from file names, and jSite is normally delivered in a lowercase
    // file name. Do this after creating the global so that if an AMD module wants
    // to call noConflict to hide this version of jSite, it will work.

    // Note that for maximum portability, libraries that are not jSite should
    // declare themselves as anonymous modules, and avoid setting a global if an
    // AMD loader is present. jSite is a special case. For more information, see
    // https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

    if (typeof define === 'function' && define.amd) {
        define('jsite', [], function() {
            return jSite;
        });
    }

    var
    // Map over jSite in case of overwrite
        _jSite = window.jSite,
    // Map over the j in case of overwrite
        _j = window.j;

    jSite.noConflict = function(deep) {
        if (window.j === jSite) {
            window.j = _j;
        }

        if (deep && window.jSite === jSite ) {
            window.jSite = _jSite;
        }

        return jSite;
    };

    // Expose jSite and j identifiers, even in AMD
    // and CommonJS for browser emulators (#13566)
    if (typeof noGlobal === 'undefined') {
        window.jSite = window.j = jSite;
    }

    return jSite;
}));
