export function upsert(model, value, condition) {
  return model.findOne({ where: condition }).then(obj => {
    if (obj) {
      // update
      return obj.update(value);
    } else {
      // insert
      return model.create(value);
    }
  });
}
