var _ = require('lodash');
var factory = require('../factory');

var dateTimeRegex   = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}|:\d{2}\.\d+)?(Z|[+-]\d{2}:\d{2})?$/;
var dateTimeMessage = 'should be a date with time in ISO8601 format';
var dateRegex   = /^\d{4}-\d{2}-\d{2}$/;
var dateMessage = 'should be a date in ISO8601 format';

module.exports = factory({
  initialize: function(opts) {
    var defaultOpts = {time: true};
    if (!opts) {
      opts = defaultOpts;
    } else {
      opts = _.defaults(opts, defaultOpts);
    }
    this.opts = opts;
  },
  match: function(path, value) {
    if (typeof value !== 'string') {
      return dateMessage;
    }
    if (!this.opts.time && dateRegex.test(value) === false) {
      return dateMessage;
    }
    if (this.opts.time && dateTimeRegex.test(value) === false) {
      return dateTimeMessage;
    }
  },
  toJSONSchema: function() {
    return {
      type: 'string',
      format: 'ISO8601'
    };
  }
});
