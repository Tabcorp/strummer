var factory = require('../factory');

module.exports = factory({
  initialize: function(regex, opts) {
    this.regex = regex;
    this.description = opts ? opts.description : null;
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

  toJSONSchema: function () {
    var schema = { type: 'string', pattern: this.regex.source };
    if (this.description) {
      schema.description = this.description;
    }
    return schema
  }
});
