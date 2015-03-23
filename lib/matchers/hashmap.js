var _ = require('lodash');
var s = require('../s');

module.exports = function (opts) {

  var matchers = { keys: null, values: null };

  if (typeof opts === 'object') {
    matchers.keys = opts.keys ? s(opts.keys) : null;
    matchers.values = opts.values ? s(opts.values) : null;
  } else if (opts) {
    matchers.values = s(opts);
  }

  return function(path, obj) {

    if (obj == null || typeof obj !== 'object') {
      return [{path: path, value: obj, message: 'should be a hashmap'}];
    }

    var errors = [];
    if (matchers.keys) {
      var keyErrors = s.array({of: matchers.keys})(path + '.keys', Object.keys(obj));
      errors.push(keyErrors);
    }
    if (matchers.values) {
      errors.push(_.map(obj, function(val, key) {
        return matchers.values(path + '[' + key + ']', val);
      }));
    }
    return _.compact(_.flatten(errors));
  };

};
