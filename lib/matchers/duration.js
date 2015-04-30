var ms       = require('ms');
var factory  = require('../factory');

var TYPE_ERROR = 'should be a duration string (e.g. \"10s\")';

module.exports = factory({
  initialize: function(opts) {
    this.opts = opts || {};

    this.minValue = (this.opts.min != null) ? ms(this.opts.min) : 0;
    this.maxValue = (this.opts.max != null) ? ms(this.opts.max) : Number.MAX_VALUE;

    if (typeof this.minValue !== 'number') {
      throw new Error('Invalid minimum duration: ' + this.opts.min);
    }

    if (typeof this.maxValue !== 'number') {
      throw new Error('Invalid maximum duration: ' + this.opts.max);
    }
  },
  match: function(path, value) {
    if (typeof value !== 'string') return TYPE_ERROR;

    var duration = ms(value);
    if (typeof duration !== 'number') return TYPE_ERROR;

    if (this.opts.min && this.opts.max && (duration < this.minValue || duration > this.maxValue)) {
      return 'should be a duration between ' + this.opts.min + ' and ' + this.opts.max;
    }
    if (this.opts.min && (duration < this.minValue)) {
      return 'should be a duration >= ' + this.opts.min;
    }
    if (this.opts.max && (duration > this.maxValue)) {
      return 'should be a duration <= ' + this.opts.max;
    }

    return null;
  },
  toJSONSchema: function() {
    var schema = {
      type: 'string',
      pattern: '^((?:\\d+)?\.?\\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)$'
    };
    return schema;
  }
});
