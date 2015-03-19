var hasValue = function(val){
  return (typeof val !== 'undefined') && (val !== null);
}

var isNumber = function(val){
  return typeof val === 'number';
}

module.exports = {
  hasValue: hasValue,
  isNumber: isNumber
}
