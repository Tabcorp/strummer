var factory  = require('../factory');

var CIDR_REGEX = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\/([0-9]|[1-2][0-9]|3[0-2])$/;

module.exports = factory({
  initialize: function(opts) {
    if (!opts || opts.version !== 4) {
      throw new Error('Must be initialized with version 4');
    }
  },
  toJSONSchema: function() {
    return {
      type: 'string',
      pattern: CIDR_REGEX.source
    };
  },
  match: function(path, value) {
    if (!CIDR_REGEX.test(value)) {
      return 'should be a valid IPv4 cidr';
    }
    return null;
  }
});
