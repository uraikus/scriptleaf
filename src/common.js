function assignAttributes (object, attributes) {
  for (let attr in attributes) {
    if (typeof attributes[attr] === 'object' && Array.isArray(attributes[attr]) === false) {
      object[attr] = {}
      assignAttributes(object[attr], attributes[attr])
    } else object[attr] = attributes[attr]
  }
}

export { assignAttributes }
