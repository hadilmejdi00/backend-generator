const CreateProduct = require('../application/usecases/CreateProduct');
const GetAllProduct = require('../application/usecases/GetAllProduct');
const GetByIdProduct = require('../application/usecases/GetByIdProduct');
const UpdateProduct = require('../application/usecases/UpdateProduct');
const DeleteProduct = require('../application/usecases/DeleteProduct');

// Mock du repository
const mockProductRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
};

describe('Product UseCases', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('CreateProduct - doit créer un produit', async () => {
    const productData = { title: 'Phone', price: 500, description: 'Nice phone' };
    mockProductRepository.create.mockResolvedValue(productData);

    const usecase = new CreateProduct(mockProductRepository);
    const result = await usecase.execute(productData);

    expect(mockProductRepository.create).toHaveBeenCalledTimes(1);
    expect(result).toEqual(productData);
  });

  test('GetAllProduct - doit retourner tous les produits', async () => {
    const products = [
      { title: 'Phone', price: 500 },
      { title: 'Laptop', price: 1000 }
    ];
    mockProductRepository.findAll.mockResolvedValue(products);

    const usecase = new GetAllProduct(mockProductRepository);
    const result = await usecase.execute();

    expect(mockProductRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(2);
  });

  test('GetByIdProduct - doit retourner un produit par ID', async () => {
    const product = { title: 'Phone', price: 500 };
    mockProductRepository.findById.mockResolvedValue(product);

    const usecase = new GetByIdProduct(mockProductRepository);
    const result = await usecase.execute('123');

    expect(mockProductRepository.findById).toHaveBeenCalledWith('123');
    expect(result).toEqual(product);
  });

  test('UpdateProduct - doit modifier un produit', async () => {
    const updated = { title: 'Phone Pro', price: 700 };
    mockProductRepository.update.mockResolvedValue(updated);

    const usecase = new UpdateProduct(mockProductRepository);
    const result = await usecase.execute('123', updated);

    expect(mockProductRepository.update).toHaveBeenCalledWith('123', updated);
    expect(result).toEqual(updated);
  });

  test('DeleteProduct - doit supprimer un produit', async () => {
    mockProductRepository.delete.mockResolvedValue({ message: 'Product deleted' });

    const usecase = new DeleteProduct(mockProductRepository);
    const result = await usecase.execute('123');

    expect(mockProductRepository.delete).toHaveBeenCalledWith('123');
    expect(result).toEqual({ message: 'Product deleted' });
  });

});