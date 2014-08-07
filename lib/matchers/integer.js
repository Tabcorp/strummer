var s = require('../s');

module.exports = function (opts) {

  return s(function(value) {
    if (typeof value !== 'number' || value % 1 !== 0) {
      return 'should be an integer';
    }
    if (opts) {
      if (opts.min && opts.max && (value < opts.min || value > opts.max)) {
        return 'should be an integer between ' + opts.min + ' and ' + opts.max;
      }
      if (opts.min && value < opts.min) {
        return 'should be an integer >= ' + opts.min;
      }
      if (opts.max && value > opts.max) {
        return 'should be an integer <= ' + opts.max;
      }
    }
  });

};
