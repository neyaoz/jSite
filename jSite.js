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
        function() {
            // The jSite object is actually just the init constructor 'enhanced'
            // Need init if jSite is called (just allow error to be thrown if not included)
            return new jSite.fn.init(arguments);
        };


    jSite.fn =
        jSite.prototype = {
            version: '0.1.0-alpha.1',
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


    jSite.fn.init = function() {
        var that = this;
        var pushStack;

        //todo find DOM fonksiyonu eklenip init'e entegre edilecek.

        jSite.each(arguments, pushStack = function(i, element) {
            if (jSite.isString(element)) {
                element = that.context.querySelectorAll(element);
            }

            if (jSite.isPlainObject(element)) {
                $.extend(true, that, element);
            } else if (jSite.isElement(element) || jSite.isDocument(element) || jSite.isWindow(element)) {
                that.push(element);
            } else if (jSite.isFunction(element)) {
                jSite.ready(element);
            } else if (jSite.isArrayLike(element)) {
                jSite.each(element, pushStack);
            }
        });

        return this;
    };
    jSite.fn.init.prototype = jSite.fn;


    jSite.extend =
        jSite.fn.extend = function() {
            // todo refactoring yapilacak
            var options, name, src, copy, copyIsArray, clone,
                target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false;

            // Handle a deep copy situation
            if ( typeof target === "boolean" ) {
                deep = target;

                // Skip the boolean and the target
                target = arguments[ i ] || {};
                i++;
            }

            // Handle case when target is a string or something (possible in deep copy)
            if ( typeof target !== "object" && !jSite.isFunction(target) ) {
                target = {};
            }

            // Extend jSite itself if only one argument is passed
            if ( i === length ) {
                target = this;
                i--;
            }

            for ( ; i < length; i++ ) {
                // Only deal with non-null/undefined values
                if ( (options = arguments[ i ]) != null ) {
                    // Extend the base object
                    for ( name in options ) {
                        src = target[ name ];
                        copy = options[ name ];

                        // Prevent never-ending loop
                        if ( target === copy ) {
                            continue;
                        }

                        // Recurse if we're merging plain objects or arrays
                        if ( deep && copy && ( jSite.isPlainObject(copy) || (copyIsArray = jSite.isArray(copy)) ) ) {
                            if ( copyIsArray ) {
                                copyIsArray = false;
                                clone = src && jSite.isArray(src) ? src : [];

                            } else {
                                clone = src && jSite.isPlainObject(src) ? src : {};
                            }

                            // Never move original objects, clone them
                            target[ name ] = jSite.extend( deep, clone, copy );

                            // Don't bring in undefined values
                        } else if ( copy !== undefined ) {
                            target[ name ] = copy;
                        }
                    }
                }
            }

            // Return the modified object
            return target;
        };


    jSite.extend({
        isReady: false,
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
    jSite.ready.check = function(handle) {
        if (document.readyState === 'complete' || (!document.attachEvent && document.readyState === 'interactive')) {
            jSite.ready.start();
        } else if (handle) {
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
    jSite.ready.check(true);


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
        isPlainObject: function(obj) {
            return jSite.type(obj) === 'object'
                && !(obj.constructor
                && !{}.hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf"));
        },
        isArray: Array.isArray,
        inArray: function(obj, key) {
            return jSite.isArray(obj) && obj.indexOf(key) !== -1;
        },
        isArrayLike: function(obj) {
            if (!obj || typeof obj !== 'object') return false;
            if (jSite.isArray(obj)) return true;
            return obj.length === 0 || typeof obj.length === "number" && obj.length > 0 && (obj.length-1) in obj
        },
        isElement: function(obj) {
            return obj && obj.nodeType === 1;
        },
        isDocument: function(obj) {
            return obj && obj.nodeType === 9;
        },
        isWindow: function(obj) {
            return obj === obj.window;
        },
        isFunction: function(obj) {
            return jSite.type(obj) === 'function';
        },
        isEmpty: function(obj) {
            if (obj === null) return true;
            if (jSite.isArray(obj) || jSite.isString(obj)) return obj.length === 0;
            for (var i in obj) if (obj.hasOwnProperty(i)) return false;
            return true;
        },
        isDefined: function(obj) {
            return obj !== void 0;
        },
        isUndefined: function(obj) {
            return !jSite.isDefined(obj)
        }
    });


    jSite.extend({
        parseData: function(obj) {
            if (typeof obj === 'string') {
                try {
                    obj =
                        obj === "true" ? true : obj === "false" ? false : obj === "null" ? null :
                            // Only convert to a number if it doesn't change the string
                            +obj + "" === obj ? +obj :
                                /^(?:\{[\w\W]*}|\[[\w\W]*])$/.test(obj) ? JSON.parse(obj) :
                                    obj;
                } catch(e) {}
            }

            return obj;
        },
        setData: function(path, value) {
            if (jSite.isString(path)) {
                path = path.split('.');
            }

            var obj = {};
            var target = obj;

            for (var i = 0; i < path.length; i++) {
                obj = (obj[path[i]] = i === path.length-1 ? value : {});
            }

            return target;
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
        options: function(only, except) {
            var options = {};

            jSite.each(this.get(0).attributes, function(i, attribute, match) {
                if (match = attribute.name.match(/^option-([_.:-a-z0-9]+)/i)) {
                    jSite.extend(true, options, jSite.setData(jSite.camelCase(match[1]), jSite.parseData(attribute.value)));
                }
            });

            return jSite.getOnly(options, only, except);
        }
    });


    jSite.extend({
        md: {
            extend: jSite.extend,
            loadAll: function() {
                jSite.ready(function() {
                    jSite.md.initAll();
                    jSite.md.bindAll();
                });
            },
            init: function(name) {
                if (jSite.md.hasOwnProperty(name) && jSite.isFunction(jSite.md[name].init)) {
                    jSite.md[name].module = jSite.md[name].init.apply({});
                } else {
                    jSite.error('module does not contain a module named <' + name + '> to init.')
                }
            },
            initAll: function() {
                jSite.each(jSite.md, function(name, module) {
                    if (jSite.isPlainObject(module) && jSite.isFunction(module.init))
                        jSite.md.init(name);
                });
            },
            bind: function(name) {
                if (jSite.md.hasOwnProperty(name) && jSite.isFunction(jSite.md[name].bind)) {
                    jSite.md[name].bind.apply({module: jSite.md[name].module || {}, node: this}, [].slice.call(arguments, 1));
                } else {
                    jSite.error('module does not contain a module named <' + name + '> to bind.')
                }
            },
            bindAll: function(context) {
                jSite.each(jSite.md, function(name, module) {
                    if (jSite.isPlainObject(module) && jSite.isFunction(module.bind))
                        jSite({ context: context }, name, '[data-init~="' + name + '"]').md(name);
                });
            }
        }
    });

    jSite.fn.extend({
        md: function(name) {
            this.each(function () {
                jSite.md.bind.apply(this, [].slice.call(arguments));
            }, arguments)
        }
    });
    jSite.md.loadAll();


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

    if ( typeof define === "function" && define.amd ) {
        define("jsite", [], function() {
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