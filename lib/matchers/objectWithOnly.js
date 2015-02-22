var _ = require('lodash');
var s = require('../s');

module.exports = function(spec) {

  if (typeof spec !== 'object') {
    throw new Error('Invalid argument, must be an object');
  }

  return function (path, val) {
    var objError = s(spec)(path, val);
    if (objError.length > 0) {
      return objError;
    } else {
      var errors = [];
      for (key in val) {
        if(!spec[key]) {
          errors.push({
            path: path ? (path + '.' + key) : key,
            value: val[key],
            message: 'should not exist'
          });
        }
      }
      return _.flatten(errors);
    }
  };

};
