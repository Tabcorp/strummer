var s = require('../s');

var regex   = /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d(.\d\d\d)?Z?$/;
var message = 'should be a date in ISO8601 format';

module.exports = function (opts) {

  return s(function(value) {
    if (typeof value !== 'string') {
      return message;
    }
    if (regex.test(value) === false) {
      return message;
    }
  });

};
