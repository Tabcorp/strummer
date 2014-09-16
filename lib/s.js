var _      = require('lodash');
var util   = require('util');
var assert = require('assert');

//
// Makes a matcher out of anything (string, object, array, function...)
//

function s(spec) {

  if (typeof spec === 'function' && spec.length === 1) {
    return leaf(spec);
  }

  return function(path, obj) {

    // support for matcher(value)
    // so people don't have to call matcher('', value) at the top level
    if (arguments.length === 1) {
      obj = path;
      path = '';
    }

    // syntactic sugar
    // wrap different primitives into the corresponding matcher
    var err = null;
    if (typeof spec === 'function') {
      err = spec(path, obj);
    } else if (util.isArray(spec)) {
      err = s.array(spec[0])(path, obj);
    } else if (spec instanceof RegExp) {
      err = s.regex(spec)(path, obj);
    } else if (typeof spec === 'object') {
      err = s.object(spec)(path, obj);
    } else if (typeof spec === 'string') {
      err = s[spec]()(path, obj);
    }

    // matchers can return other matchers
    if (typeof err === 'function') {
      err = err(path, obj);
    }

    return err;
  };

};

//
// Only execute the matcher if the value is provided
//

s.optional = function(spec) {
  return function(path, value) {
    if (value === null || value === undefined) {
      return [];
    } else {
      return s(spec);
    }
  };
};

//
// Assert that an object matches a given spec
//

s.assert = function(value, spec) {
  var errors = s(spec)('', value);
  assert(errors.length === 0, errors.map(function(err) {
    return err.path + ' ' + err.message + ' (was ' + util.inspect(err.value) + ')';
  }).join('\n'));
}

//
// Make a canonical matcher
// from a function that takes a single value / returns a single error
//

function leaf(matcher) {
  return function (path, value) {
    var err = matcher(value);
    if (err) {
      return [{
        path: path,
        value: value,
        message: err
      }];
    } else {
      return [];
    }
  };
}

module.exports = s;
