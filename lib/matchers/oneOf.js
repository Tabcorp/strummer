var _ = require('lodash');
var factory = require('../factory');
var compile = require('../compile');

module.exports = factory({
  initialize: function(matchers) {
    if (!matchers) {
      throw new Error('oneOf: matchers should not be a falsy value');
    }

    if (!matchers.length) {
      throw new Error('oneOf: matchers should be a Array with length >= 1');
    }

    this.matchers = matchers.map(function(m) {
      return compile.spec(m);
    });

    this.schemas = this.matchers.map(function(m) {
      return m.toJSONSchema();
    });

    this.isSingleType = _.uniq(_.map(this.schemas, _.property('type'))).length === 1;
  },
  match: function(path, value) {
    var matcher;
    var result;

    for (var i = 0, len = this.matchers.length; i < len; ++i) {
      matcher = this.matchers[i];
      result = matcher.match(path, value);

      if (result.length === 0) {
        return '';
      }
    }

    return JSON.stringify(value)
      + ' is not valid under any of the given schemas\n'
      + this.matchers.map(function(m, nth) {
          return nth + '.\n' + JSON.stringify(m.toJSONSchema(), null, 2);
        }).join('\n');
  },
  toJSONSchema: function() {
    var result = {
      oneOf: this.schemas
    };

    if (this.isSingleType) {
      result.type = this.schemas[0].type;
    }

    return result;
  }
});
