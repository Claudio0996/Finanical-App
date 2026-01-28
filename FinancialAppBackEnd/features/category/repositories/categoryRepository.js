const Category = require("../model/category");

exports.createCategory = async (categoryData) => {
  const newCategory = await Category.create(categoryData);

  return newCategory;
};

exports.findByUserId = async (userId) => {
  return await Category.find({ userId });
};

exports.findById = async (id) => {
  return await Category.findById(id);
};

exports.findByIndex = async (indexObject) => {
  return await Category.findOne(indexObject);
};

exports.updateCategory = async (id, newData) => {
  return await Category.findOneAndUpdate({ _id: id }, newData, { new: true });
};

exports.deleteById = async (id) => {
  return await Category.findOneAndDelete({ _id: id }, { new: false });
};
