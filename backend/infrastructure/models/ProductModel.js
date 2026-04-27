const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String }
});

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);