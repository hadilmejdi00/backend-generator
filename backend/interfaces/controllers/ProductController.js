const ProductRepository = require('../../infrastructure/repositories/ProductRepository');
const CreateProduct = require('../../application/usecases/CreateProduct');
const GetAllProduct = require('../../application/usecases/GetAllProduct');
const GetByIdProduct = require('../../application/usecases/GetByIdProduct');
const UpdateProduct = require('../../application/usecases/UpdateProduct');
const DeleteProduct = require('../../application/usecases/DeleteProduct');

const productRepository = new ProductRepository();

exports.createProduct = async (req, res) => {
  try {
    const usecase = new CreateProduct(productRepository);
    const product = await usecase.execute(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllProduct = async (req, res) => {
  try {
    const usecase = new GetAllProduct(productRepository);
    const product = await usecase.execute();
    res.status(200).json(product); // ⚡ ici c’est bien "products"
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.getByIdProduct = async (req, res) => {
  try {
    const usecase = new GetByIdProduct(productRepository);
    const product = await usecase.execute(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const usecase = new UpdateProduct(productRepository);
    const product = await usecase.execute(req.params.id, req.body);
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.deleteProduct = async (req, res) => {
  try {
    const usecase = new DeleteProduct(productRepository);
    await usecase.execute(req.params.id);
    res.status(200).json({ message: "Produit supprimé avec succès ✅" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
