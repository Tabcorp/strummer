var factory = require('../factory');
var compile = require('../compile');

module.exports = factory({
  initialize: function(spec) {
    this.child = compile.spec(spec);
    this.optional = true;
  },
  match: function(path, val) {
    return this.child.match(path, val);
  },
  toJSONSchema: function() {
    return this.child.toJSONSchema();
  }
});
