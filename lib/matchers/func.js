var s = require('../s');

module.exports = function (opts) {

  if (!opts) opts = {};

  return s(function(value) {
    if (typeof value !== 'function') {
      return 'should be a function';
    }
    if (typeof(opts.arity) === 'number') {
      if (value.length !== opts.arity) {
        return 'should be a function with ' + opts.arity + ' parameter' + (opts.arity === 1 ? '' : 's');
      }
    }
  });

};
