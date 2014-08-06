var s = require('./s');

exports.string = function (opts) {
  return s(function(value) {
    if (typeof value !== 'string') {
      return 'should be a string';
    }
  });
};

exports.number = function (opts) {
  return s(function(value) {
    if (typeof value !== 'number') {
      return 'should be a number';
    }
  });
};
