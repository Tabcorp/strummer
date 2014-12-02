var ms = require('ms');
var s = require('../s');

var TYPE_ERROR = 'should be a duration string (e.g. \"10s\")';

module.exports = function (opts) {

  if (!opts) opts = {};
  var minValue = (typeof opts.min === 'string') ? ms(opts.min) : 0;
  var maxValue = (typeof opts.max === 'string') ? ms(opts.max) : Number.MAX_VALUE;

  return s(function(value) {

    if (typeof value !== 'string') return TYPE_ERROR;

    var duration = ms(value);
    if (typeof duration !== 'number') return TYPE_ERROR;

    if (duration < minValue || duration > maxValue) {
      return 'should be a duration between ' + opts.min + ' and ' + opts.max;
    }

    return null;

  });

};
