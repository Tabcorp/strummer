var ms = require('ms');
var s = require('../s');

var TYPE_ERROR = 'should be a duration string (e.g. \"10s\")';

module.exports = function (opts) {

  if (!opts) opts = {};

  var minValue = (opts.min != null) ? ms(opts.min) : 0;
  var maxValue = (opts.max != null) ? ms(opts.max) : Number.MAX_VALUE;

  if (typeof minValue !== 'number') {
    throw new Error('Invalid minimum duration: ' + opts.min);
  }

  if (typeof maxValue !== 'number') {
    throw new Error('Invalid maximum duration: ' + opts.max);
  }

  return s(function(value) {

    if (typeof value !== 'string') return TYPE_ERROR;

    var duration = ms(value);
    if (typeof duration !== 'number') return TYPE_ERROR;

    if (opts.min && opts.max && (duration < minValue || duration > maxValue)) {
      return 'should be a duration between ' + opts.min + ' and ' + opts.max;
    }
    if (opts.min && (duration < minValue)) {
      return 'should be a duration >= ' + opts.min;
    }
    if (opts.max && (duration > maxValue)) {
      return 'should be a duration <= ' + opts.max;
    }

    return null;

  });

};
