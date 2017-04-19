var factory = require('../factory');

module.exports = factory({
  initialize: function (opts) {
    this.min = opts ? opts.min : null;
    this.max = opts ? opts.max : null;
    this.name = opts ? opts.name : null;
  },
  match: function(path, value) {
    if(this.name)
      name = this.name.trim() + ' '
    else
      name = ''

    if (typeof value !== 'string') {
      return name + 'should be a string';
    }
    if (this.min && this.max && (value.length < this.min || value.length > this.max)) {
      return name + 'should have a length between ' + this.min + ' and ' + this.max;
    }
    if (this.min && value.length < this.min) {
      return name + 'should have a length bigger than or equals to ' + this.min;
    }
    if (this.max && value.length > this.max) {
      return name + 'should have a length smaller than or equals to ' + this.max;
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

    return schema;
  }
});
