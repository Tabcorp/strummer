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
    this.opts = opts || {};

    var hasMinValue = hasValue(this.opts.min);
    var hasMaxValue = hasValue(this.opts.max);

    if (hasMinValue && !_.isNumber(this.opts.min)) {
      throw new Error('Invalid minimum option: ' + this.opts.min);
    }

    if (hasMaxValue && !_.isNumber(this.opts.max)) {
      throw new Error('Invalid maximum option: ' + this.opts.max);
    }

    this.min = this.opts.min;
    this.max = this.opts.max;
    this.parse = this.opts.parse || false;
    this.description = this.opts.description;

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
