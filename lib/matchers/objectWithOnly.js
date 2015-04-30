var _ = require('lodash');
var factory = require('../factory');
var s = require('../strummer');

module.exports = factory({
  initialize: function(spec) {
    if (typeof spec !== 'object') {
      throw new Error('Invalid argument, must be an object');
    }

    this.spec = spec;
    this.matcher = new s.object(this.spec);
  },

  match: function (path, val) {
    var objError = this.matcher.match(path, val);
    var key;
    if (objError.length > 0) {
      return objError;
    } else {
      var errors = [];
      for (key in val) {
        if (!this.spec[key]) {
          errors.push({
            path: path ? (path + '.' + key) : key,
            value: val[key],
            message: 'should not exist'
          });
        }
      }
      return _.flatten(errors);
    }
  },
  toJSONSchema: function() {
    var schema = this.matcher.toJSONSchema();
    schema.additionalProperties = false;
    return schema;
  }
});
