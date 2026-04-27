class UpdateProductDto {
  constructor({ title, price, description }) {
    this.title = title;
    this.price = price;
    this.description = description || null;
  }

  validate() {
    if (this.price !== undefined && this.price < 0) throw new Error('Price must be positive');
  }
}

module.exports = UpdateProductDto;