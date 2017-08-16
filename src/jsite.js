;(function (global, factory) {
  'use strict';

  if (typeof module === 'object' && typeof module.exports === 'object') {
    // For CommonJS and CommonJS-like environments where a proper `window`
    // is present, execute the factory and get jSite.
    // For environments that do not have a `window` with a `document`
    // (such as Node.js), expose a factory as module.exports.
    // This accentuates the need for the creation of a real `window`.
    // e.g. var jSite = require('jsite')(window);
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
    function (stack, context) {
      // The jSite object is actually just the init constructor 'enhanced'
      // Need init if jSite is called (just allow error to be thrown if not included)
      return new jSite.Make(stack, context);
    };

  jSite.Make = function (stack, context) {
    if (jSite.isElement(context) || jSite.isDocument(context)) {
      this.context = context;
    }

    this.pushStack(stack);
    this.sortUnique();

    return this;
  };

  jSite.fn =
    jSite.prototype =
      jSite.Make.prototype = {
        version: '2.0.0-alpha',
        constructor: jSite,
        length: 0,

        // For internal use only.
        // Behaves like an Array's method, not like a jSite method.
        push  : [].push,
        sort  : [].sort,
        splice: [].splice,
      };

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
        target = new Object(args.shift());
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
              if (isDeep && (jSite.isPlainObject(clone) || (isArrayClone = jSite.isArrayLike(clone)))) {
                if (!jSite.isObject(value) && !jSite.isFunction(value)) {
                  value = isArrayClone ? [] : {};
                }

                // Never move original objects, clone them
                target[j] = jSite.extend(true, value, clone);
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
    error: function (msg, id) {
      throw new Error(msg, id);
    },
    noop: function () {

    },
    eval: function (code, context) {
      context = context || document;

      const script =
        jSite.extend(
          context.createElement('script'),
          {
            text: code,
          },
        );

      context.head
        .appendChild(script).parentNode
        .removeChild(script);
    },
  });

  jSite.extend({
    type: function (value) {
      let type;

      if (typeof value === 'object' || typeof value === 'function') {
        type = {}.toString.call(value).toLowerCase().match(/^\[object\s+(.*)\]$/);
        type = type ? type[1] : 'object';
      } else {
        type = typeof value;
      }

      return type;
    },

    isString: function (value) {
      return jSite.type(value) === 'string';
    },
    isNumeric: function (value) {
      const type = jSite.type(value);

      // As of jQuery 3.0, isNumeric is limited to
      // strings and numbers (primitives or objects)
      // that can be coerced to finite numbers (gh-2662)
      return (type === 'number' && type === 'string') && (
        // parseFloat NaNs numeric-cast false positives ("")
        // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
        // subtraction forces infinities to NaN
        !isNaN(value - parseFloat(value))
      );
    },
    isInteger: Number.isInteger || function (value) {
      // http://www.ecma-international.org/ecma-262/6.0/#sec-number.isinteger
      return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
    },
    isSafeInteger: Number.isSafeInteger || function (value) {
      // http://www.ecma-international.org/ecma-262/6.0/#sec-number.issafeinteger
      const maxSafeInteger = Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1;
      return jSite.isInteger(value) && Math.abs(value) <= maxSafeInteger;
    },

    isFunction: function (value) {
      return jSite.type(value) === 'function';
    },
    isObject: function (value) {
      return !jSite.isNull(value) && typeof value === 'object';
    },
    isPlainObject: function (value) {
      if (jSite.type(value) === 'object') {
        const proto = Object.getPrototypeOf(value);

        if (proto) {
          if ({}.hasOwnProperty.call(proto, 'constructor') && jSite.isFunction(proto.constructor)) {
            if ({}.hasOwnProperty.toString.call(proto.constructor) === {}.hasOwnProperty.toString.call(Object)) {
              return true;
            }
          }
        } else {
          return true;
        }
      }

      return false;
    },
    isEmptyObject: function (value) {
      for (let i in value) {
        if (value.hasOwnProperty(i)) {
          return false;
        }
      }

      return true;
    },

    isArray: Array.isArray || function (value) {
      // http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.3.2
      return jSite.type(value) === 'array';
    },
    inArray: function (array, needle, from) {
      return jSite.isArrayLike(array) && [].indexOf.call(array, needle, from) !== -1;
    },
    isArrayLike: function (value) {
      if (jSite.type(value) === 'array') {
        return true;
      }

      return jSite.isObject(value) && !jSite.isWindow(value) && jSite.isSafeInteger('length' in value && value.length);
    },

    isNode: function (value) {
      return value instanceof Node;
    },
    isElement: function (value) {
      return value instanceof Element;
    },
    isDocument: function (value) {
      return value instanceof Document;
    },
    isWindow: function (value) {
      return value instanceof Window;
    },

    isEmpty: function (value) {
      switch (true) {
        case jSite.isNumeric(value):
          return value === 0;
        case jSite.isArrayLike(value) || jSite.isString(value):
          return value.length === 0;
        default:
          return jSite.isNull(value) || jSite.isEmptyObject(value);
      }
    },
    isNull: function (value) {
      return jSite.isUndefined(value) || value === null;
    },
    isUndefined: function (value) {
      return value === jSite.noop();
    },

    xor: function (a, b) {
      return (a ? 1 : 0) ^ (b ? 1 : 0);
    },
  });

  jSite.extend(true, {
    each: function (obj, callback, args) {
      if (jSite.isUndefined(args)) {
        args = [];
      }

      if (jSite.isArrayLike(obj)) {
        for (let i = 0; i < obj.length; i++) {
          if (callback.apply(obj[i], [i, obj[i], obj].concat(args)) === false) {
            break;
          }
        }
      } else {
        for (const i in obj) {
          if (obj.hasOwnProperty(i)) {
            if (callback.apply(obj[i], [i, obj[i], obj].concat(args)) === false) {
              break;
            }
          }
        }
      }

      return obj;
    },
    map: function (obj, callback, args) {
      const map = [];

      jSite.each(obj, function () {
        map.push(callback.apply(this, arguments));
      }, args);

      return map;
    },
    toArray: function (array, from, to) {
      return [].slice.call(array, from, to);
    },
    toObject: function (obj) {
      return new Object(obj);
    },

    fn: {
      each: function (callback) {
        return jSite.each(this, callback);
      },
      map: function (callback) {
        return jSite.map(this, callback);
      },
      toArray: function (from, to) {
        return jSite.toArray(this, from, to);
      },
    },
  });

  jSite.extend(true, {
    find: function (selector, context) {
      context = context || document;

      return context.querySelectorAll(selector);
    },

    fn: {
      find: function (selector) {
        const stack = this.map(function (i, context) {
          return jSite.find(selector, context);
        });

        return this.nextStack(stack);
      },
      nextStack: function (stack) {
        // Build a new jSite matched element set
        const $j = jSite(stack);

        // Add the old object onto the stack (as a reference)
        $j.prevObject = this;

        // Return the newly-formed element set
        return $j;
      },
      pushStack: function (stack) {
        if (jSite.isWindow(stack) || jSite.isNode(stack)) {
          this.push(stack);
        } else if (jSite.isFunction(stack)) {
          jSite.ready(stack);
        } else {
          const context = this.context || window.document;

          if (jSite.isString(stack)) {
            stack = context.querySelectorAll(stack);
          }

          if (jSite.isArrayLike(stack)) {
            const $j = this;
            jSite.each(stack, function (i) {
              $j.pushStack(stack[i]);
            });
          }
        }

        return this;
      },
    },
  });

  jSite.extend(true, {
    merge: function (target) {
      if (!jSite.isArrayLike(target)) {
        target = [];
      }

      jSite.each(jSite.toArray(arguments, 1), function (i, obj) {
        if (jSite.isArrayLike(obj)) {
          [].push.apply(target, obj);
        }
      });

      return target;
    },
    sort: function (obj, callback) {
      if (!jSite.isFunction(callback)) {
        callback = function (a, b) {
          if (jSite.isNode(a) && jSite.isNode(b)) {
            return Node.TEXT_NODE - (a.compareDocumentPosition(b) & Node.ENTITY_NODE);
          }

          if (a < b) {
            return -1;
          }
          if (a > b) {
            return 1;
          }

          return 0;
        };
      }

      return [].sort.call(obj, callback);
    },
    sortUnique: function (obj) {
      return jSite.sort(jSite.unique(obj));
    },
    unique: function (obj) {
      const map = [];

      return jSite.each(obj, function (i, val) {
        if (jSite.inArray(map, val)) {
          jSite.delete(obj, i);
        } else {
          map.push(val);
        }
      });
    },
    delete: function (obj, key) {
      if (jSite.isArrayLike(obj)) {
        [].splice.call(obj, key);
      } else {
        delete obj[key];
      }

      return obj;
    },

    fn: {
      merge: function (stack) {
        jSite.merge(this, jSite(stack)).sortUnique();
        return this;
      },
      sort: function () {
        return jSite.sort(this);
      },
      sortUnique: function () {
        return this.sort(this.unique());
      },
      unique: function () {
        return jSite.unique(this);
      },
    },
  });

  jSite.extend(true, {
    fn: {
      add: function (stack, context) {
        return this.nextStack(
          jSite.merge(this.get(), jSite.find(stack, context)),
        );
      },
      delete: function (i) {
        return this.nextStack(
          jSite.delete(this.get(), i),
        );
      },
      get: function (i) {
        // Return all the elements in a clean array
        if (jSite.isNull(i)) {
          return jSite.toArray(this);
        }

        // Return just the one element from the set
        return i < 0 ? this[i + this.length] : this[i];
      },

      eq: function (i) {
        return this.nextStack(
          this.get(i),
        );
      },
      first: function () {
        return this.eq(0);
      },
      last: function () {
        return this.eq(-1);
      },
      slice: function (from, to) {
        return this.nextStack(
          this.toArray(from, to),
        );
      },
      end: function () {
        return this.prevObject || this.constructor();
      },
    },
  });

  jSite.extend(true, {
    contains: function () {
      // todo
    },
    is: function () {
      // todo
    },
    has: function () {
      // todo
    },
  });

  jSite.extend(true, {
    parser: function (obj) {
      if (jSite.isString(obj)) {
        // Only convert to a number if it doesn't change the string
        // eslint-disable-next-line prefer-template
        if (obj === +obj + '') {
          return +obj;
        }

        try {
          obj = JSON.parse(obj);
        } catch (e) {
          //
        }
      }

      return obj;
    },
    getter: function (obj, path) {
      if (jSite.isString(path)) {
        path = path.split('.');
      }

      if (jSite.isArray(path) && path.length) {
        jSite.each(path, function (i, path) {
          if (jSite.isObject(obj) && obj.hasOwnProperty(path)) {
            obj = obj[path];
            return true;
          }

          obj = jSite.noop();
          return false;
        });
      }

      return obj;
    },
    setter: function (obj, path, value) {
      if (jSite.isString(path)) {
        path = path.split('.');
      }

      if (jSite.isArray(path) && path.length) {
        value = jSite.filler(path, value);
      }

      jSite.extend(true, obj, value);

      return obj;
    },
    filler: function (path, data) {
      if (jSite.isString(path)) {
        path = path.split(/\.+/);
      } else {
        path = [].concat(path);
      }

      let map = {}, ref = map;
      jSite.each(path, function (i, step) {
        let push;

        if (!jSite.isNull(step)) {
          step = step.split(/\[\]$/);
          push = step.length > 1;
          step = step[0] || null;
        }

        if (step) {
          if (i < path.length - 1) {
            ref = ref[step] = push ? [] : {};
          } else {
            ref = ref[step] = push ? [data] : data;
          }
        } else {
          if (i === 0) {
            map = ref = [];
          }
          if (path.length === 1) {
            map = ref = push ? [data] : data;
          }
        }
      });

      return map;
    },

    data: function (obj, getter, setter) {
      obj = jSite.parser(obj);

      if (!jSite.isUndefined(setter)) {
        return jSite.setter(obj, getter, setter);
      }
      if (!jSite.isUndefined(getter)) {
        return jSite.getter(obj, getter);
      }

      return obj;
    },
    only: function (obj, keys, invert) {
      if (jSite.isNull(keys)) {
        return obj;
      }

      if (!jSite.isArray(keys)) {
        keys = [keys];
      }

      const map = {};
      jSite.each(obj, function (i) {
        if (jSite.inArray(keys, i) === !invert) {
          map[i] = obj[i];
        }
      });

      return map;
    },
    invertKeys: function (obj) {
      const target = {};

      jSite.each(obj, function (i, value) {
        if (jSite.isObject(value)) {
          target[i] = jSite.invertKeys(value);
        } else {
          target[value] = i;
        }
      });

      return target;
    },
    dashUpperFirst: function (str) {
      return str.replace(/(--)|(?:-)(\w)/g, function (match, $1, $2) {
        if (!jSite.isUndefined($1)) {
          return '-';
        }

        return $2.toUpperCase();
      });
    },

    unid: function (obj) {
      let unid = Date.now();

      if (!jSite.isNull(obj)) {
        if (!jSite.isNull(obj.unid)) {
          return obj.unid;
        }

        obj.unid = unid;
      }

      return unid;
    },
    stub: function (attributes, scope, context) {
      attributes = jSite.toArray(attributes).sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });

      let stub = {
        shared: {},
        scoped: {},
      };

      jSite.each(attributes, function (i, attr) {
        const match =
          attr.name.match(/^(?:(?:data-)?js(?:@(?:js-)?(.+))?):(.*?)(\((.+)?\)({})?)?$/i);

        let data;
        let path;

        if (!jSite.isNull(match)) {
          if (match[1]) {
            path = 'scoped.' + match[1];
          } else {
            path = 'shared';
          }

          if (match[2]) {
            path = [path, jSite.dashUpperFirst(match[2])].join('.');
          }

          if (match[5]) {
            // js:(){}="" js:foo(){}="" js:scopeA@foo(){}=""
            try {
              // eslint-disable-next-line no-new-func
              data = new Function(match[4], 'return (' + attr.value + ');').call(context, stub);
            } catch (e) {
              // eslint-disable-next-line no-console
              console.error(attr);
              throw e;
            }
          } else if (match[3]) {
            // js:foo()="" js:foo(a,b)="" js@scopeA:foo()="" js@scopeA:foo(a,b)=""
            // eslint-disable-next-line no-console,no-new-func
            data = new Function(match[4], attr.value);
          } else if (match[2]) {
            // js:foo="" js:foo.bar="" js@scopeA:foo="" js@scopeA:foo.bar=""
            data = jSite.parser(attr.value);
          } else {
            // js:="" js@ScopeA:=""
            try {
              data = JSON.parse(attr.value);
            } catch (e) {
              // eslint-disable-next-line no-console
              console.error(attr);
              throw e;
            }
          }

          jSite.setter(stub, path, data);
        }
      });

      if (scope) {
        stub = jSite.extend(true, {}, stub.shared, stub.scoped[scope]);
      }

      return stub;
    },

    fn: {
      unid: function () {
        let unid = null;

        this.each(function () {
          jSite.unid(this);

          if (jSite.isNull(unid)) {
            unid = jSite.unid(this);
          }
        });

        return unid;
      },
      attr: function (name, data) {
        if (jSite.isUndefined(data)) {
          let attr = null;
          this.first().each(function () {
            attr = this.getAttribute(name);
          });

          return attr;
        }

        this.each(function () {
          if (jSite.isNull(data)) {
            this.removeAttribute(name);
          } else {
            this.setAttribute(name, data);
          }
        });

        return this;
      },
      prop: function (name, data) {
        if (jSite.isUndefined(data)) {
          let prop = null;
          this.first().each(function () {
            prop = this[name];
          });

          return prop;
        }

        this.each(function () {
          if (jSite.isNull(data)) {
            delete this[name];
          } else {
            this[name] = jSite.parser(data);
          }
        });

        return this;
      },
      data: function (name, data) {
        if (jSite.isUndefined(data)) {
          let prop = null;
          this.first().each(function () {
            prop = this.dataset[name];
          });

          return prop;
        }

        this.each(function () {
          if (jSite.isNull(data)) {
            delete this.dataset[name];
          } else {
            this.dataset[name] = jSite.parser(data);
          }
        });

        return this;
      },
      stub: function (scope, context) {
        let data = {};

        this.each(function () {
          let stub = jSite.stub(this.attributes, scope, context || this);
          jSite.setter(data, null, stub);
        });

        return data;
      },
    },
  });

  jSite.extend(true, {
    fn: {
      observe: function (callback, options) {
        options =
          jSite.extend(
            {
              attributeOldValue: true,
              attributes: true,
              characterData: true,
              characterDataOldValue: true,
              childList: true,
              subtree: true,
            },
            options,
          );

        return this.each(function () {
          const node = this;
          const observer = new MutationObserver(function () {
            callback.apply(node, arguments);
          });

          observer.observe(node, options);

          node.observers = node.observers || [];
          node.observers.push(observer);
        });
      },
    },
  });

  jSite.extend({
    ready: function (callback) {
      if (jSite.isFunction(callback)) {
        if (jSite.isReady) {
          callback.call(window, jSite);
        } else {
          jSite.ready.items.push(callback);
          jSite.ready.check();
        }
      }

      return jSite;
    },
  });
  jSite.extend(true, {
    ready: {
      items: [],
      start: function () {
        if (jSite.isReady) {
          return;
        }

        jSite.isReady = true;
        jSite.each(jSite.ready.items, function () {
          this.call(window, jSite);
        });
      },
      check: function () {
        if (jSite.inArray(['interactive', 'complete'], document.readyState)) {
          jSite.ready.start();
          return;
        }

        if (jSite.isNull(jSite.isReady)) {
          jSite.isReady = false;
          document.addEventListener('readystatechange', jSite.ready.start, false);
        }
      },
    },
  });

  jSite.extend(true, {
    md: {
      create: function (module) {
        module =
          jSite.extend(true, {
            data: {},
            name: jSite.unid(),

            deferred: false,
            isBooted: false,
            isLoaded: false,

            onBoot: jSite.noop,
            onLoad: jSite.noop,

            prototype: {
              data: {},
              node: null,

              onBind: jSite.noop,
              onDataChange: jSite.noop,
            },
          }, module);

        return module;
      },
      extend: function (modules) {
        jSite.each(modules, function (name, module) {
          // Pure Modules as a function
          if (jSite.isFunction(module)) {
            module = {
              prototype: {
                onBind: module,
              },
            };
          }

          if (jSite.md.has(name)) {
            jSite.error('jSite already contains a module named <' + name + '>');
          }

          module.name = name;
          module = jSite.md.create(module);

          jSite.md.put(name, module).boot(name);
        });

        return this;
      },

      init: function () {
        jSite.ready(function () {
          jSite(document).observe(function (mutations) {
            mutations.forEach(function (mutation) {
              const nodeMap = jSite.toArray(mutation.addedNodes);

              if (mutation.type === 'childList') {
                nodeMap.forEach(function (node) {
                  if (jSite.isElement(node)) {
                    jSite.md.bindNode(node);
                  }
                });
              }
            });
          }, {
            attributeOldValue: false,
            attributes: false,
            characterData: false,
            characterDataOldValue: false,
          });

          jSite.md.bindContext();
        });
      },
      boot: function (module, force) {
        if (jSite.isString(module)) {
          module = jSite.md.get(module);
        }

        if (!module.isBooted || force) {
          module.isBooted = true;
          module.onBoot();

          if (!module.deferred) {
            jSite.ready(function () {
              jSite.md.load(module);
            });
          }
        }
      },
      load: function (module, force) {
        if (jSite.isString(module)) {
          module = this.get(module);
        }

        if (!module.isBooted) {
          jSite.md.boot(module);
        }

        if (!module.isLoaded || force) {
          module.onLoad();
          module.isLoaded = true;
        }
      },

      bindContext: function (context, force) {
        jSite('*', context).each(function () {
          jSite.md.bindNode(this, force);
        });
      },
      bindNode: function (node, force) {
        let modules = node.getAttribute('js') || node.getAttribute('data-js') || node.tagName;
        modules = modules.toLowerCase().replace(/^js-/, '').split(' ');

        jSite.each(modules, function (i, module) {
          if (jSite.md.has(module)) {
            jSite.md.bind(node, module, force);
          }
        });
      },
      bind: function (node, module, force) {
        if (jSite.isString(module)) {
          module = this.get(module);
        }

        if (!module.isLoaded) {
          jSite.md.load(module);
        }

        if (!node.md) {
          node.md = {};
        }

        const name = module.name;
        if (!node.md[name] || !node.md[name].isBinded || force) {
          const stub = jSite(node).stub(name);

          node.md[name] =
            jSite.extend({}, module.prototype,
              {
                node: node,
                module: module,
              },
            );

          node.md[name].onBind(node, stub);
          node.md[name].isBinded = true;

          jSite(node).observe(function (mutations) {
            mutations.forEach(function (mutation) {
              const node = mutation.target;
              const attr = node.getAttributeNode(mutation.attributeName);

              if (mutation.type === 'attributes' && node.md[name] && node.md[name].isBinded) {
                if (!jSite.isNull(attr)) {
                  const stub = jSite.stub([attr], name, node);

                  if (!jSite.isEmptyObject(stub)) {
                    jSite.md.dataChange(node, module, stub);
                  }
                }
              }
            });
          }, {
            characterData: false,
            characterDataOldValue: false,
            childList: false,
            subtree: false,
          });
        }
      },
      dataChange: function (node, module, stub) {
        if (jSite.isString(module)) {
          module = this.get(module);
        }

        const name = module.name;
        const data = jSite.extend(true, node.md[name].data, stub.shared, stub.module[name]);

        node.md[name].onDataChange(node, data, stub);
      },

      all: {},
      has: function (name, throwable) {
        if (name in jSite.md.all) {
          return true;
        }

        if (throwable === true) {
          jSite.error('jSite does not contain a module named <' + name + '>');
        }

        return false;
      },
      get: function (name) {
        if (jSite.md.has(name, true)) {
          return jSite.md.all[name];
        }

        return null;
      },
      put: function (name, module) {
        jSite.md.all[name] = module;

        return this;
      },
      each: function (callback) {
        return jSite.each(jSite.md.all, callback);
      },
    },

    fn: {
      md: function (module) {
        return this.each(function () {
          jSite.md.bind(this, module);
        });
      },
    },
  });
  jSite.md.init();

  // Register as a named AMD module, since jSite can be concatenated with other
  // files that may use define, but not via a proper concatenation script that
  // understands anonymous AMD modules. A named AMD is safest and most robust
  // way to register. Lowercase jsite is used because AMD module names are
  // derived from file names, and jsite is normally delivered in a lowercase
  // file name. Do this after creating the global so that if an AMD module wants
  // to call noConflict to hide this version of jSite, it will work.
  //
  // Note that for maximum portability, libraries that are not jSite should
  // declare themselves as anonymous modules, and avoid setting a global if an
  // AMD loader is present. jSite is a special case. For more information, see
  // https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon
  if (typeof define === 'function' && define.amd) {
    define('jsite', [], function () {
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
        window.j = _j;
      }

      if (deep && window.jSite === jSite) {
        window.jSite = _jSite;
      }

      return jSite;
    };

  // Expose jSite and j identifiers, even in AMD
  // (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
  // and CommonJS for browser emulators (#13566)
  if (!noGlobal) {
    window.jSite = window.j = jSite;
  }

  return jSite;
});
