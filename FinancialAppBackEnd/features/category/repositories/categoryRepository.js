const user = require("../../user/models/user");
const category = require("../model/category");
const Category = require("../model/category");

exports.createCategory = async (categoryData) => {
  const newCategory = await Category.create(categoryData);

  return newCategory;
};

//Função para encontrar categoria por índice
exports.findById = async (id) => {
  return await Category.findById(id);
};

exports.findByIndex = async (indexObject) => {
  return await Category.findOne(indexObject);
};

exports.findCategory = async (userId, filters) => {
  const query = { userId };

  if (filters) {
    query.type = filters.type;
  }

  if (filters) {
    query.name = filters.name;
  }

  if (filters) {
    query.name = filters.color;
  }

  return await Category.find(query);
};

exports.updateCategory = async (id, newData) => {
  return await Category.findOneAndUpdate({ _id: id }, newData, { new: true });
};

exports.deleteById = async (id) => {
  return await Category.findOneAndDelete({ _id: id }, { new: false });
};
