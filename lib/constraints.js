var Constraint = Object.create({
  validate: function (path, val, func) {
    var errors = func(path, val)

    if (!errors) {
      return []
    }

    return errors
  }
})

module.exports = Constraint
