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
        } else if (typeof spec[key] === 'object') {
          var subpath = path ? (path + '.' + key) : key;
          var matcher = s.exactObject(spec[key]);
          var err = matcher(subpath, val[key]);
          if (err) errors.push(err)
        }
      }
      return _.flatten(errors);
    }
  };

};
