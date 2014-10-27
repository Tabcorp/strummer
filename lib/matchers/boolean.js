var _ = require('lodash');
var s = require('../s');

var parseBool = function (value) {
  if ((typeof value === 'string') && (value.toLowerCase() == 'true')) {
    return true;
  }
  else if ((typeof value === 'string') && (value.toLowerCase() == 'false')) {
    return false;
  }
  else {
    return value;
  }
};

module.exports = function (opts) {

  if (!opts) opts = {};

  return s(function(value) {
    
    if (opts.parse) {
      value = parseBool(value);
    }

    if (typeof value !== 'boolean') {
      return 'should be a boolean';
    }
  });

};
