var utils = require('../utils');
var _ = require('lodash');
var factory = require('../factory');

var hasValue = utils.hasValue;

function parseFloatFromString(value) {
  if (/^(\-|\+)?([0-9]+(\.[0-9]+)?)$/.test(value)) {
    return Number(value);
  }
  return value;
}

module.exports = factory({
  initialize: function(opts) {
    opts = opts || {};

    var hasMinValue = hasValue(opts.min);
    var hasMaxValue = hasValue(opts.max);

    if (hasMinValue && !_.isNumber(opts.min)) {
      throw new Error('Invalid minimum option: ' + opts.min);
    }

    if (hasMaxValue && !_.isNumber(opts.max)) {
      throw new Error('Invalid maximum option: ' + opts.max);
    }

    this.min = hasMinValue ? opts.min : null;
    this.max = hasMaxValue ? opts.max : null;
    this.parse = opts ? opts.parse : false;
    this.description = opts ? opts.description : null;

    if (this.min != null && this.max != null && this.min > this.max) {
      throw new Error('Invalid option: ' + this.min + ' > ' + this.max);
    }
  },
  match: function(path, value) {
    if (this.parse) {
      value = parseFloatFromString(value);
    }
    if (typeof value !== 'number') {
      return 'should be a number';
    }

    if (this.min != null && this.max != null && (value < this.min || value > this.max)) {
      return 'should be a number between ' + this.min + ' and ' + this.max;
    }
    if (this.min != null && value < this.min) {
      return 'should be a number >= ' + this.min;
    }
    if (this.max != null && value > this.max) {
      return 'should be a number <= ' + this.max;
    }
  },
  toJSONSchema: function() {
    var schema = { type: 'number' };

    if (this.min) {
      schema.minimum = this.min;
    }
    if (this.max) {
      schema.maximum = this.max;
    }
    if (this.description) {
      schema.description = this.description;
    }
    return schema;
  }
});
