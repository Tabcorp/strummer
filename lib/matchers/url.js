var url     = require('url');
var factory = require('../factory');

var MESSAGE = "should be a URL";

module.exports = factory({
  initialize: function() {},
  match: function(path, value) {
    var u, valid;
    if (typeof value !== 'string') {
      return MESSAGE;
    }

    u = url.parse(value);
    valid = u.protocol && u.host && u.pathname;
    if (!valid) {
      return MESSAGE;
    }
  }
});
