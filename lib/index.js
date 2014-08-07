var path = require('path');
var all  = require('require-all');
var s    = require('./s');

// Mount all matchers
var matchers = all(path.join(__dirname, 'matchers'));
for (name in matchers) {
  s[name] = matchers[name];
}

module.exports = s;
