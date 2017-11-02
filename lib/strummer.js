var inspect = require('util-inspect');
var factory = require('./factory');
var index   = require('./index');
var compile = require('./compile');
var Matcher = require('./matcher');

// s(...) compiles the matcher
module.exports = exports = function(name, spec) {
  if (arguments.length === 1) {
    spec = name;
    name = null;
  }

  var matcher = compile.spec(spec);

  if (name) {
    matcher.setName(name);
  }

  return matcher;
};

// expose s.Matcher so people can create custom matchers
exports.Matcher = Matcher;

exports.createMatcher = factory;

// we also expose s.string, s.number, ...
// they are required inline here and stored in another module to break some cyclic dependencies
index.matchers = {
  array: require('./matchers/array'),
  boolean: require('./matchers/boolean'),
  duration: require('./matchers/duration'),
  email: require('./matchers/email'),
  enum: require('./matchers/enum'),
  func: require('./matchers/func'),
  hashmap: require('./matchers/hashmap'),
  integer: require('./matchers/integer'),
  ip: require('./matchers/ip'),
  isoDate: require('./matchers/isoDate'),
  number: require('./matchers/number'),
  object: require('./matchers/object'),
  objectWithOnly: require('./matchers/objectWithOnly'),
  oneOf: require('./matchers/oneOf'),
  optional: require('./matchers/optional'),
  regex: require('./matchers/regex'),
  string: require('./matchers/string'),
  url: require('./matchers/url'),
  uuid: require('./matchers/uuid'),
  value: require('./matchers/value')
}

for (var matcherName in index.matchers) {
  exports[matcherName] = index.matchers[matcherName];
}

// s.assert() for easy unit tests
exports.assert = function(value, matcher) {
  var errors = compile.spec(matcher).match('', value);
  if (errors.length > 0) {
    var errMessage = errors.map(function(err) {
      return err.path + ' ' + err.message + ' (was ' + inspect(err.value) + ')';
    }).join('\n');
    throw new Error(errMessage)
  };
};
