
var s = require('./s');

// Complex matchers
s.object = require('./object');
s.array = require('./array');

// Leaf matchers
var matchers = require('./matchers');
for (name in matchers) {
  s[name] = matchers[name];
}

module.exports = s;
