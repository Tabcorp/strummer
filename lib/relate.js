exports.validate = function (spec, path, val, relationships) {
  var errors = [];
  relationships.forEach(function (relations) {
    var values = relations.values
    var relationType = relations.type

    var validOr = false

    values.forEach(function (relation) {
      if (!spec[relation]) {
        errors.push({
          path: path,
          value: relation,
          message: relation + ' does not exist in the schema'
        });
      } else if (
        relationType === 'and' &&
        !Object.keys(val).includes(relation)
      ) {
        errors.push({
          path: path,
          value: values,
          message: JSON.stringify(values) + ' are related and therefore required'
        })
      } else if (
        relationType === 'or' &&
        Object.keys(val).includes(relation)
      ) {
        validOr = true
      }
    })

    if (relationType === 'or' && !validOr) {
      errors.push({
        path: path,
        value: values,
        message: 'at least one of ' + JSON.stringify(values) + ' are required'
      })
    }
  })

  return errors
}
