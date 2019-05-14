function upsert(model, value, condition) {
  return model.findOne({ where: condition }).then(function(obj) {
    if (obj) {
      // update
      return obj.update(value);
    } else {
      // insert
      return model.create(value);
    }
  });
}
module.exports = {
  upsert,
};
