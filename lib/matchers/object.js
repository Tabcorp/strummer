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
      var subpath = path ? (path + '.' + key) : key;
      var err = this.fields[key].match(subpath, value[key]);
      if (err) errors.push(err);
    }
    return _.compact(_.flatten(errors));
  }
});
