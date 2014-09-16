var s = require('../s');

module.exports = function (opts) {

  if (typeof opts.test !== 'function') {
    throw new Error('Invalid regex matcher');
  }

  return s(function(value) {
    if (typeof value !== 'string') {
      return 'should be a string';
    }
    if (!opts.test(value)) {
      var str = opts.toString();
      return 'should match the regex ' + str.slice(1, str.length - 1);
    }
  });

};
