var _       = require('lodash');
var Matcher = require('../matcher');
var factory = require('../factory');
var compile = require('../compile');
var s       = require('../strummer');

module.exports = factory({
  initialize: function(opts) {
    var matchers = { keys: null, values: null };
    if (opts instanceof Matcher) {
      matchers.values = opts;
    } else if (typeof opts === 'object') {
      matchers.keys = opts.keys ? compile.spec(opts.keys) : null;
      matchers.values = opts.values ? compile.spec(opts.values) : null;
    } else if (opts) {
      matchers.values = compile.spec(opts);
    }

    this.matchers = matchers;
  },

  match: function(path, obj) {
    if (obj == null || typeof obj !== 'object') {
      return [{path: path, value: obj, message: 'should be a hashmap'}];
    }

    var errors = [];
    if (this.matchers.keys) {
      var keyErrors = new s.array({of: this.matchers.keys}).match(path + '.keys', Object.keys(obj));
      errors.push(keyErrors);
    }
    if (this.matchers.values) {
      errors.push(_.map(obj, function(val, key) {
        return this.matchers.values.match(path + '[' + key + ']', val);
      }, this));
    }

    return _.compact(_.flattenDeep(errors));
  }
});

