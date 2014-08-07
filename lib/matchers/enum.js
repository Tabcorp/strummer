var util = require('util');
var s    = require('../s');

module.exports = function (opts) {

  if (util.isArray(opts.values) === false) {
    throw new Error('Invalid enum values: ' + opts.values);
  }

  return s(function(value) {
    if (opts.values.indexOf(value) === -1) {
      var detail = opts.verbose ? (' (' + opts.values.join(',') + ')') : '';
      var type = opts.name || 'enum value';
      return 'should be a valid ' + type + detail;
    }
  });

};
