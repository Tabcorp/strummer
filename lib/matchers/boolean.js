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
  },
  match: function(path, value) {
    if (this.opts.parse) {
      value = parseBool(value);
    }

    if (typeof value !== 'boolean') {
      return 'should be a boolean';
    }
  }
});
