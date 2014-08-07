var s = require('../s');

var regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

module.exports = function (opts) {

  if (!opts) opts = {};
  var message = 'should be a UUID' + (opts.version ? ' version ' + opts.version : '');

  return s(function(value) {

    if (typeof value !== 'string') {
      return message;
    }

    if (regex.test(value) === false) {
      return message;
    }

    // UUID version
    var version = value[14];
    if (opts.version && opts.version.toString() !== version) {
      return message;
    }

  });

};
