let ProductModel;
try {
  ProductModel = require('../models/ProductModel');
} catch (err) {
  ProductModel = null;
}

const { products } = require("../data/products");

class ProductRepository {
  async findAll() {
    if (ProductModel && process.env.MONGODB_URI) {
      return ProductModel.find().lean();
    }
    return products;
  }

  async findById(productId) {
    if (ProductModel && process.env.MONGODB_URI) {
      return ProductModel.findOne({ id: Number(productId) }).lean();
    }
    return products.find((product) => product.id === Number(productId));
  }
}

module.exports = { ProductRepository };
