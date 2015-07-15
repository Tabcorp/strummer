var assert  = require('assert');
var util    = require('util');
var path    = require('path');
var all     = require('require-all');
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
// they are stored in another module to break some cyclic dependencies
index.matchers = all(path.join(__dirname, 'matchers'));
for (var matcherName in index.matchers) {
  exports[matcherName] = index.matchers[matcherName];
}

// s.assert() for easy unit tests
exports.assert = function(value, matcher) {
  var errors = compile.spec(matcher).match('', value);
  assert(errors.length === 0, errors.map(function(err) {
    return err.path + ' ' + err.message + ' (was ' + util.inspect(err.value) + ')';
  }).join('\n'));
};
