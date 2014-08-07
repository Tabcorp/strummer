var _ = require('lodash');
var s = require('../s');

module.exports = function(opts) {

  var spec = opts;

  return function (path, obj) {
    var errors = [];
    if(obj == null || typeof obj !== 'object') {
      return [{path: path, value: obj, message: 'should be an object'}];
    }
    for (key in spec) {
      var subpath = path ? (path + '.' + key) : key;
      var matcher = s(spec[key]);
      var err = matcher(subpath, obj[key]);
      if (err) errors.push(err)
    }
    return _.flatten(errors);
  };

};
