var util = require('util');
var index = require('./index');
var Matcher = require('./matcher');

exports.spec = function compile(spec) {
  var matcher = null;
  if (Matcher.is(spec)) {
    matcher = spec;
  } else if (util.isArray(spec)) {
    matcher = new index.matchers.array(spec[0]);
  } else if (spec instanceof RegExp) {
    matcher = new index.matchers.regex(spec);
  } else if (typeof spec === 'object') {
    matcher = new index.matchers.object(spec);
  } else if (typeof spec === 'string') {
    matcher = new index.matchers[spec]();
  }
  if (!matcher) {
    throw new Error('Invalid matcher: ' + spec);
  }
  return matcher;
};
