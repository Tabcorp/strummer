var factory = require('../factory');

module.exports = factory({
  initialize: function (opts) {
    this.min = opts ? opts.min : null;
    this.max = opts ? opts.max : null;
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
  }
});
