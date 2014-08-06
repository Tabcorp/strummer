var _    = require('lodash');
var util = require('util');

// Core library

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

// Complex matchers

s.object = function(opts) {
  var spec = opts;
  return function (path, obj) {
    var errors = [];
    for (key in spec) {
      var subpath = path ? (path + '.' + key) : key;
      var matcher = s(spec[key]);
      var err = matcher(subpath, obj[key]);
      if (err) errors.push(err)
    }
    return _.flatten(errors);
  };
};

s.array = function(opts) {
  return function(path, obj) {
    if (util.isArray(obj) === false) {
      return [{path: path, value: obj, message: 'should be an array'}];
    }
    return _.compact(obj.map(function(val, index) {
      return opts.of(path + '[' + index + ']', val);
    }));
  };
};

// Leaf matchers

s.string = function (opts) {
  return leaf(function(value) {
    if (typeof value !== 'string') {
      return 'should be a string';
    }
  });
};

s.number = function (opts) {
  return leaf(function(value) {
    if (typeof value !== 'number') {
      return 'should be a number';
    }
  });
};

// That's all folks!

module.exports = s;
