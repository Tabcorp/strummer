var s = require('../s');

module.exports = function (opts) {

  if (!opts) opts = {};

  return s(function(value) {
    if (typeof value !== 'string') {
      return 'should be a string';
    }

    if (opts) {
      if (opts.min && opts.max && (value.length < opts.min || value.length > opts.max)) {
        return 'should be a string with length between ' + opts.min + ' and ' + opts.max;
      }
      if (opts.min && value.length < opts.min) {
        return 'should be a string with length >= ' + opts.min;
      }
      if (opts.max && value.length > opts.max) {
        return 'should be a string with length <= ' + opts.max;
      }
    }

  });

};
