var s = require('../s');

module.exports = function (opts) {

  return s(function(value) {
    if (typeof value !== 'number') {
      return 'should be a number';
    }
    if (opts) {
      if (opts.min && opts.max && (value < opts.min || value > opts.max)) {
        return 'should be a number between ' + opts.min + ' and ' + opts.max;
      }
      if (opts.min && value < opts.min) {
        return 'should be a number >= ' + opts.min;
      }
      if (opts.max && value > opts.max) {
        return 'should be a number <= ' + opts.max;
      }
    }
  });

};
