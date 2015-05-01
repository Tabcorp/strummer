var util    = require('util');
var factory = require('../factory');

module.exports = factory({
  initialize: function(opts) {
    opts = opts || {};
    this.name = opts.name;
    this.values = opts.values;
    this.verbose = opts.verbose;
    if (util.isArray(this.values) === false) {
      throw new Error('Invalid enum values: ' + this.values);
    }
  },
  match: function(path, value) {
    if (this.values.indexOf(value) === -1) {
      var detail = this.verbose ? (' (' + this.values.join(',') + ')') : '';
      var type = this.name || 'enum value';
      return 'should be a valid ' + type + detail;
    }
  },
  toJSONSchema: function() {
    return { 'enum': this.values };
  }
});
