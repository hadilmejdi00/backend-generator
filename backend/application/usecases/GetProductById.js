const Product = require("../../domain/entities/Product");

class GetProductById {
  async execute(id) {
    return await Product.findById(id);
  }
}

module.exports = GetProductById;