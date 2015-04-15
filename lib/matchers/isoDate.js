var _ = require('lodash');
var factory = require('../factory');

var dateTimeRegex   = /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d(.\d\d\d)?Z?$/;
var dateTimeMessage = 'should be a date with time in ISO8601 format';
var dateRegex   = /^\d\d\d\d-\d\d-\d\d$/;
var dateMessage = 'should be a date in ISO8601 format';

module.exports = factory({
  initialize: function(opts) {
    defaultOpts = {time: true}
    if (!opts) opts = defaultOpts;
    else opts = _.defaults(opts, defaultOpts)
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
  }
});
