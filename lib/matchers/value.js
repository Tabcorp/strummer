var _ = require('lodash');
var factory  = require('../factory');

module.exports = factory({
  initialize: function (expectedValue, opts) {
    this.opts = opts || {};
    this.description = this.opts.description;
    if (typeof expectedValue === 'undefined' || _.isObject(expectedValue)) {
      throw new Error('must provide a primitive value to match');
    }
    this.expectedValue = expectedValue;
  },
  match: function(path, value) {
    if (value !== this.expectedValue) {
      return 'should strict equal ' + String(this.expectedValue);
    }
  },
  toJSONSchema: function () {
    var schema = { 'enum': [this.expectedValue] };
    if (this.description) {
      schema.description = this.description;
    }
    return schema;
  }
});
