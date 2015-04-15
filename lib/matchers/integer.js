var _        = require('lodash');
var utils    = require('../utils');
var factory  = require('../factory');
var hasValue = utils.hasValue;

var parseIntFromString = function (value) {
  if(/^(\-|\+)?([0-9]+)$/.test(value))
    return Number(value);
  return value;
}

module.exports = factory({
  initialize: function(opts) {
    this.hasMinValue = false;
    this.hasMaxValue = false;

    if (hasValue(opts)) {
      this.hasMinValue = hasValue(opts.min);
      this.hasMaxValue = hasValue(opts.max);

      if (this.hasMinValue && !_.isNumber(opts.min)) {
        throw new Error('Invalid minimum option: ' + opts.min);
      }

      if (this.hasMaxValue && !_.isNumber(opts.max)) {
        throw new Error('Invalid maximum option: ' + opts.max);
      }
    } else {
      opts = {};
    }
    this.opts = opts;
  },
  match: function(path, value) {
    var opts = this.opts;
    if (opts.parse) {
      value = parseIntFromString(value);
    }

    if (typeof value !== 'number' || value % 1 !== 0) {
      return 'should be an integer';
    }

    if (this.hasMinValue && this.hasMaxValue && (value < opts.min || value > opts.max)) {
      return 'should be an integer between ' + opts.min + ' and ' + opts.max;
    }
    if (this.hasMinValue && value < opts.min) {
      return 'should be an integer >= ' + opts.min;
    }
    if (this.hasMaxValue && value > opts.max) {
      return 'should be an integer <= ' + opts.max;
    }
  }
});
