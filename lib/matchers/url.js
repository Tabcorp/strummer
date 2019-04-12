var url     = require('url');
var factory = require('../factory');

var MESSAGE = 'should be a URL';

module.exports = factory({
  initialize: function (opts) {
    this.opts = opts || {};
    this.description = this.opts.description;
  },
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
  },
  toJSONSchema: function() {
    var schema = {
      type: 'string',
      format: 'url'
    };
    if (this.description) {
      schema.description = this.description;
    }
    return schema;
  }
});
