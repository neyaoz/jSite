;(function (global, connect) {
  'use strict';

  const jSite = {
    version: '2.0.0-alpha',
    require: {
      jQuery: '>=2.0',
    },
  };
  jSite.connect = function (jQuery) {
    jQuery.jSite = connect(global, jQuery);
    jQuery.md = jQuery.jSite.md;

    return jQuery.jSite;
  };

  // Map over jSite in case of overwrite
  const _jSite = global.jSite;

  // Map over the j in case of overwrite
  const _j = global.j;

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

  // Expose jSite and j identifiers
  global.jSite = global.j = jSite;

  if (global.jQuery) {
    jSite.connect(global.jQuery);
  }

  return jSite;
})(typeof window !== 'undefined' ? window : this, function (window, jQuery) {
  'use strict';

  const jSite = {
    extend: jQuery.extend,
  };

  jSite.extend({
    noop: function () {},
  });

  jSite.extend({
    parseData: function (data) {
      if (typeof data === 'string') {
        // Only convert to a number if it doesn't change the string
        // eslint-disable-next-line prefer-template
        if (data === +data + '') {
          return +data;
        }

        try {
          data = JSON.parse(data);
        } catch (e) {
          //
        }
      }

      return data;
    },
    getData: function (obj, path) {
      if (jSite.isUndefined(obj) || jSite.isUndefined(path)) {
        return obj;
      }

      if (typeof path === 'string') {
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
    invertKeys: function (obj) {
      const target = {};

      for (const i in obj) {
        if (obj.hasOwnProperty(i)) {
          target[obj[i]] = i;
        }
      }

      return target;
    },
    camelCase: function (str) {
      return str.replace(/(--)|(?:-)([a-z])/g, function (match, $1, $2) {
        if (typeof $1 !== 'undefined') {
          return '-';
        }
        return $2.toUpperCase();
      });
    },
  });

  jSite.extend(true, {
    md: {

    },
  });

  return jSite;
});
