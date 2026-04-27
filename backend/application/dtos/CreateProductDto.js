class CreateProductDto {
  constructor({ title, price, description }) {
    this.title = title;
    this.price = price;
    this.description = description || null;
  }

  validate() {
    if (!this.title) throw new Error('Title is required');
    if (this.price === undefined || this.price === null) throw new Error('Price is required');
    if (this.price < 0) throw new Error('Price must be positive');
  }
}

module.exports = CreateProductDto;