class UpdateProduct {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }

    async execute(id, productData) {
        return await this.productRepository.update(id, productData);
    }
}

module.exports = UpdateProduct;
