var _ = require('lodash');
var factory = require('../factory');
var s = require('../strummer');

module.exports = factory({
  initialize: function(spec, constraints) {
    if (typeof spec !== 'object') {
      throw new Error('Invalid spec, must be an object');
    }

    if (constraints && typeof constraints !== 'function') {
      throw new Error('Invalid constraints, must be a function');
    }

    this.spec = spec;
    this.matcher = new s.object(this.spec);
    this.constraints = constraints
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

      if (this.constraints) {
        errors = errors.concat(
          this.constraints(path, val)
        )
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
