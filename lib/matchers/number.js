var s        = require('../s');
var utils    = require('../utils');
var hasValue = utils.hasValue;
var isNumber = utils.isNumber;

var parseFloatFromString = function (value) {
  if(/^(\-|\+)?([0-9]+(\.[0-9]+)?)$/.test(value))
    return Number(value);
  return value;
}

module.exports = function (opts) {
  var hasMinValue = false;
  var hasMaxValue = false;

  if(hasValue(opts)) {
    hasMinValue = hasValue(opts.min);
    hasMaxValue = hasValue(opts.max);

    if(hasMinValue && !isNumber(opts.min)) {
      throw new Error('Invalid minimum option: ' + opts.min);
    }

    if(hasMaxValue && !isNumber(opts.max)) {
      throw new Error('Invalid maximum option: ' + opts.max);
    }
  } else {
    opts = {};
  }

  return s(function(value) {
    if (opts.parse) {
      value = parseFloatFromString(value);
    }

    if (typeof value !== 'number') {
      return 'should be a number';
    }

    if (hasMinValue && hasMaxValue && (value < opts.min || value > opts.max)) {
      return 'should be a number between ' + opts.min + ' and ' + opts.max;
    }
    if (hasMinValue && value < opts.min) {
      return 'should be a number >= ' + opts.min;
    }
    if (hasMaxValue && value > opts.max) {
      return 'should be a number <= ' + opts.max;
    }
  });

};
