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

  return function(path, obj) {

    // check that it's an array
    if (util.isArray(obj) === false) {
      return [{path: path, value: obj, message: 'should be an array'}];
    }

    // call the matcher on each item
    return _.flatten(obj.map(function(val, index) {
      return s(opts.of)(path + '[' + index + ']', val);
    }));

  };

};
