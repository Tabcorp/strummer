var factory  = require('../factory');

function parseBool(value) {
  if ((typeof value === 'string') && (value.toLowerCase() === 'true')) {
    return true;
  }
  else if ((typeof value === 'string') && (value.toLowerCase() === 'false')) {
    return false;
  }
  else {
    return value;
  }
}

module.exports = factory({
  initialize: function(opts) {
    this.opts = opts || {};
    this.description = this.opts.description;
  },
  match: function(path, value) {
    if (this.opts.parse) {
      value = parseBool(value);
    }

    if (typeof value !== 'boolean') {
      return 'should be a boolean';
    }
  },
  safeParse: function(path, value) {
    var parsedValue = parseBool(value);

    if (typeof parsedValue === 'boolean') {
      return { value: parsedValue }
    }

    return { errors: [{ path: path, message: 'should be a boolean' }] };
  },
  toJSONSchema: function () {
    var schema = { type: 'boolean' };
    if (this.description) {
      schema.description = this.description;
    }
    return schema;
  }
});
