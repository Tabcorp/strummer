var _ = require('lodash');
var factory  = require('../factory');

module.exports = factory({
  initialize: function(expectedValue) {
    if (typeof expectedValue === 'undefined' || _.isObject(expectedValue)) {
      throw new Error('must provide a primitive value to match');
    }
    this.expectedValue = expectedValue;
  },
  match: function(path, value) {
    if (value !== this.expectedValue) {
      return 'should strict equal ' + this.expectedValue.toString();
    }
  },
  toJSONSchema: function() {
    return { 'enum': [this.expectedValue] };
  }
});
