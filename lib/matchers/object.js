var _ = require('lodash');
var compile = require('../compile');
var factory = require('../factory');

module.exports = factory({
  initialize: function(opts) {
    this.fields = _.mapValues(opts, compile.spec);
  },
  match: function(path, value) {
    var errors = [];
    var key;
    if (value == null || typeof value !== 'object') {
      return [{path: path, value: value, message: 'should be an object'}];
    }
    for (key in this.fields) {
      if ({}.hasOwnProperty.call(this.fields, key)) {
        var subpath = path ? (path + '.' + key) : key;
        var err = this.fields[key].match(subpath, value[key]);
        if (err) errors.push(err);
      }
    }
    return _.compact(_.flatten(errors));
  },
  toJSONSchema: function() {
    var self = this;
    var propKeys = Object.keys(this.fields);

    var requiredFields = propKeys.filter(function(field) {
      return !self.fields[field].optional;
    });

    var properties = propKeys.reduce(function(props, key) {
      var subSchema = self.fields[key].toJSONSchema();
      if (!Object.keys(subSchema).length) {
        requiredFields = requiredFields.filter(function(k) { return k !== key; });
        return props;
      }
      props[key] = self.fields[key].toJSONSchema();
      return props;
    }, {});

    var schema = {
      type: 'object',
      required: requiredFields,
      properties: properties
    };

    return schema;
  }
});
