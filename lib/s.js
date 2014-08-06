var _    = require('lodash');
var util = require('util');

//
// Makes a matcher out of anything (string, object, array, function...)
//

function s(spec) {

  if (typeof spec === 'function' && spec.length === 1) {
    return leaf(spec);
  }

  return function(path, obj) {
    if (obj === undefined) {
      obj = path;
      path = '';
    }
    var err = null;
    if (typeof spec === 'function') {
      err = spec(path, obj);
    } else if (typeof spec === 'object') {
      err = s.object(spec)(path, obj)
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
