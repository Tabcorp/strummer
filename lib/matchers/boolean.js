var s = require('../s');

module.exports = function (opts) {

  return s(function(value) {
    if (typeof value !== 'boolean') {
      return 'should be a boolean';
    }
  });

};
