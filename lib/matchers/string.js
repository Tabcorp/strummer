var s = require('../s');

module.exports = function (opts) {

  return s(function(value) {
    if (typeof value !== 'string') {
      return 'should be a string';
    }
  });

};
