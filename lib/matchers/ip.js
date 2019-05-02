var factory  = require('../factory');

var IP_REGEX = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;

module.exports = factory({
  initialize: function(opts) {
    if (!opts || opts.version !== 4) {
      throw new Error('Must be initialized with version 4');
    }
    this.description = opts ? opts.description : null;
  },
  toJSONSchema: function () {
    var schema = {
      type: 'string',
      pattern: IP_REGEX.source
    };

    if (this.description) {
      schema.description = this.description;
    }
    return schema;
  },
  match: function(path, value) {
    if (!IP_REGEX.test(value)) {
      return 'should be a valid IPv4 address';
    }
    return null;
  }
});
