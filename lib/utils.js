function hasValue(val) {
  return (typeof val !== 'undefined') && (val !== null);
}

module.exports = {
  hasValue: hasValue
};
