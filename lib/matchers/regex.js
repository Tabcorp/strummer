var factory = require('../factory');

module.exports = factory({
  initialize: function(opts) {
    this.regex = opts;
    if (!this.regex || typeof this.regex.test !== 'function') {
      throw new Error('Invalid regex matcher');
    }
  },

  match: function(path, value) {
    if (typeof value !== 'string') {
      return 'should be a string';
    }
    if (!this.regex.test(value)) {
      return 'should match the regex ' + this.regex.toString();
    }
  },

  toJSONSchema: function() {
    return { type: 'string', pattern: this.regex.source };
  }
});
