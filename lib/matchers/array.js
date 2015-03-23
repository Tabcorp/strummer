var util = require('util');
var _    = require('lodash');
var s    = require('../s');

module.exports = function(opts) {

  if (typeof opts === 'string') {
    opts = {of: opts};
  }

  else if (typeof opts === 'function') {
    opts = {of: opts};
  }

  else if (typeof opts === 'object' && !opts.of) {
    throw new Error('Invalid array matcher: missing <of>');
  }

  return function(path, obj) {

    // check that it's an array
    if (util.isArray(obj) === false) {
      return [{path: path, value: obj, message: 'should be an array'}];
    }

    if (opts) {
      if (opts.min && opts.max && (obj.length < opts.min || obj.length > opts.max)) {
        return [{path: path, value: obj, message:'should have between ' + opts.min + ' and ' + opts.max + ' items'}];
      }
      if (opts.min && obj.length < opts.min) {
        return [{path: path, value: obj, message:'should have at least ' + opts.min + ' items'}];
      }
      if (opts.max && obj.length > opts.max) {
        return [{path: path, value: obj, message:'should have at most ' + opts.max + ' items'}]
      }
    }

    // call the matcher on each item
    return _.compact(_.flatten(obj.map(function(val, index) {
      return s(opts.of)(path + '[' + index + ']', val);
    })));

  };

};
