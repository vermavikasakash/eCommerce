const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  productId: Number,
  name: String,
  price: Number,
  image: String,
  quantity: Number,
  lineTotal: Number,
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  id: { type: String, unique: true, index: true },
  customerId: String,
  customer: Object,
  items: [OrderItemSchema],
  total: Number,
  payment: Object,
  status: String,
  createdAt: String,
}, { timestamps: true });

module.exports = mongoose.models.Order || mongoose.model('Order', OrderSchema);