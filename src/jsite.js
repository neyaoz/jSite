/* eslint-disable object-shorthand */
;(function (global, factory) {
  'use strict';

  if (typeof module === 'object' && typeof module.exports === 'object') {
    // For CommonJS and CommonJS-like environments where a proper `window`
    // is present, execute the factory and get jSite.
    // For environments that do not have a `window` with a `document`
    // (such as Node.js), expose a factory as module.exports.
    // This accentuates the need for the creation of a real `window`.
    // e.g. var jSite = require('jquery')(window);
    // See ticket #14549 for more info.
    module.exports =
      global.document ? factory(global, true) : function (w) {
        if (!w.document) {
          throw new Error('jSite requires a window with a document');
        }
        return factory(w);
      };
  } else {
    factory(global);
  }
})(typeof window !== 'undefined' ? window : this, function (window, noGlobal) {
  'use strict';

  const jSite =
    function (selector, context) {
      // The jQuery object is actually just the init constructor 'enhanced'
      // Need init if jQuery is called (just allow error to be thrown if not included)
      return new jSite.fn.Make(selector, context);
    };

  jSite.fn =
    jSite.prototype = {
      version: '2.0.0-alpha',
      constructor: jSite,
      length: 0,

      // For internal use only.
      // Behaves like an Array's method, not like a jSite method.
      push  : Array.prototype.push,
      sort  : Array.prototype.sort,
      splice: Array.prototype.splice,
    };

  jSite.fn.Make = function (selector, context) {
    const root = this;

    if (jSite.isElement(context) || jSite.isDocument(context)) {
      root.context = context;
    }

    let pushStack;
    jSite.each([selector], pushStack = function (i, node) {
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
  jSite.fn.Make.prototype = jSite.fn;

  jSite.extend =
    jSite.fn.extend = function () {
      const args = [].slice.call(arguments);

      let target = this;
      let isDeep = false;

      // Handle a deep copy situation
      if (typeof args[0] === 'boolean') {
        isDeep = args.shift(); // Skip the boolean
      }

      // Handle case when target is a string or something (possible in deep copy)
      if (args.length > 1) {
        target = args.shift();

        if (typeof target !== 'object' && typeof target !== 'function') {
          target = {};
        }
      }

      for (let i = 0; i < args.length; i++) {
        const object = args[i];

        // Extend the base object
        for (const j in object) {
          if (object.hasOwnProperty(j)) {
            let value = target[j];
            let clone = object[j];

            // Prevent never-ending loop
            if (value !== clone) {
              let isArrayClone;

              // Recurse if we're merging plain objects or arrays
              if (isDeep && (jSite.isPlain(clone) || (isArrayClone = jSite.isArray(clone)))) {
                if (isArrayClone) {
                  jSite.isArray(value) || (value = []);
                } else {
                  jSite.isPlain(value) || jSite.isFunction(value) || jSite.fn === value || (value = {});
                }

                // Never move original objects, clone them
                target[j] = jSite.extend(isDeep, value, clone);
              } else if (typeof clone !== 'undefined') { // Don't bring in undefined values
                target[j] = clone;
              }
            }
          }
        }
      }

      // Return the modified object
      return target;
    };

  jSite.extend({
    type: function (obj) {
      let type;

      if (typeof obj === 'object' || typeof obj === 'function') {
        type = {}.toString.call(obj).toLowerCase().match(/^\[object\s+([a-z]+)]$/);
        type = type ? type[1] : 'object';
      } else {
        type = typeof obj;
      }

      return type;
    },
    isString: function (obj) {
      return jSite.type(obj) === 'string';
    },
    isNumeric: function(obj) {
      return !jSite.isArray(obj) && (obj - parseFloat(obj) + 1) >= 0;
    },
    isObject: function(obj) {
      return typeof obj === 'object';
    },
    isPlain: function(obj) {
      return jSite.type(obj) === 'object'
        && !(obj.constructor
        && !{}.hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf' ));
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
    toArray: function(obj, from, to) {
      return Array.prototype.slice.call(obj, from, to);
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
      return !jSite.isDefined(obj);
    },
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

  jSite.fn.extend({
    // Execute a callback for every element in the matched set.
    each: function (callback) {
      return this.constructor.each(this, callback);
    },

    get: function (i) {
      // Return all the elements in a clean array
      if (i === null) {
        return this.toArray();
      }

      // Return just the one element from the set
      return i < 0 ? this[i + this.length] : this[i];
    },

    eq: function (i) {
      return this.pushStack([this.get(i)]);
    },

    // Take an array of elements and push it onto the stack
    // (returning the new matched element set)
    pushStack: function (stack) {
      // Build a new jSite matched element set
      const $stack = this.constructor.merge(this.constructor(), stack);

      // Add the old object onto the stack (as a reference)
      $stack.prevObject = this;

      // Return the newly-formed element set
      return $stack;
    },

    toArray: function (from, to) {
      return this.constructor.toArray(this, from, to);
    },
  });

  // Register as a named AMD module, since jSite can be concatenated with other
  // files that may use define, but not via a proper concatenation script that
  // understands anonymous AMD modules. A named AMD is safest and most robust
  // way to register. Lowercase jquery is used because AMD module names are
  // derived from file names, and jSite is normally delivered in a lowercase
  // file name. Do this after creating the global so that if an AMD module wants
  // to call noConflict to hide this version of jSite, it will work.
  //
  // Note that for maximum portability, libraries that are not jSite should
  // declare themselves as anonymous modules, and avoid setting a global if an
  // AMD loader is present. jSite is a special case. For more information, see
  // https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon
  if (typeof define === 'function' && define.amd) {
    define('jquery', [], function () {
      return jSite;
    });
  }

  // Map over jSite in case of overwrite
  const _jSite = window.jSite;

  // Map over the j in case of overwrite
  const _j = window.j;

  jSite.noConflict =
    function (deep) {
      if (window.j === jSite) {
        // eslint-disable-next-line no-param-reassign
        window.j = _j;
      }

      if (deep && window.jSite === jSite) {
        // eslint-disable-next-line no-param-reassign
        window.jSite = _jSite;
      }

      return jSite;
    };

  // Expose jSite and $ identifiers, even in AMD
  // (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
  // and CommonJS for browser emulators (#13566)
  if (!noGlobal) {
    // eslint-disable-next-line no-param-reassign
    window.jSite = window.j = jSite;
  }

  return jSite;
});
