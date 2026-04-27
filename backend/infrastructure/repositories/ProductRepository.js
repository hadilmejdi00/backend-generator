const IProductRepository = require('../../application/interfaces/IProductRepository');
const ProductModel = require('../models/ProductModel');
const Product = require('../../domain/entities/Product');

class ProductRepository extends IProductRepository {
  async create(product) {
    const created = await ProductModel.create(product);
    return new Product({ id: created._id.toString(), ...created.toObject() });
  }

  async findAll() {
    const products = await ProductModel.find();
    return products.map(p => new Product({ id: p._id.toString(), ...p.toObject() }));
  }

  async findById(id) {
    const p = await ProductModel.findById(id);
    if (!p) return null;
    return new Product({ id: p._id.toString(), ...p.toObject() });
  }

  async update(id, data) {
    const p = await ProductModel.findByIdAndUpdate(id, data, { new: true });
    if (!p) return null;
    return new Product({ id: p._id.toString(), ...p.toObject() });
  }

  async delete(id) {
    const p = await ProductModel.findByIdAndDelete(id);
    if (!p) return null;
    return { message: 'Product deleted' };
  }
}

module.exports = ProductRepository;