var url = require('url')
var s   = require('../s');

module.exports = function (opts) {

  if (!opts) opts = {};
  var message = "should be a URL";

  return s(function(value) {

    if (typeof value !== 'string') {
      return message;
    }

    u = url.parse(value)
    valid = u.protocol && u.host && u.pathname
    if (!valid) {
      return message;
    }

  });

};
