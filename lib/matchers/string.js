var factory = require('../factory');

module.exports = factory({
  initialize: function (opts) {
    this.opts = opts || {};
    this.min = this.opts.min;
    this.max = this.opts.max;
    this.description = this.opts.description;
  },
  match: function(path, value) {
    if (typeof value !== 'string') {
      return 'should be a string';
    }
    if (this.min && this.max && (value.length < this.min || value.length > this.max)) {
      return 'should be a string with length between ' + this.min + ' and ' + this.max;
    }
    if (this.min && value.length < this.min) {
      return 'should be a string with length >= ' + this.min;
    }
    if (this.max && value.length > this.max) {
      return 'should be a string with length <= ' + this.max;
    }
  },
  toJSONSchema: function() {
    var schema = { type: 'string' };

    if (this.min) {
      schema.minLength = this.min;
    }

    if (this.max) {
      schema.maxLength = this.max;
    }

    if (this.description) {
      schema.description = this.description;
    }

    return schema;
  }
});
