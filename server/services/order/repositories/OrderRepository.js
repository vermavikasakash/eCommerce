let OrderModel;
try {
  OrderModel = require('../models/OrderModel');
} catch (err) {
  OrderModel = null;
}

class OrderRepository {
  constructor() {
    if (!OrderModel) this.orders = [];
  }

  async create(order) {
    if (OrderModel && process.env.MONGODB_URI) {
      const created = await OrderModel.create(order);
      return created.toObject();
    }

    this.orders.unshift(order);
    return order;
  }

  async findByCustomerId(customerId) {
    if (OrderModel && process.env.MONGODB_URI) {
      return OrderModel.find({ customerId }).lean();
    }
    return this.orders.filter((order) => order.customerId === customerId);
  }
}

module.exports = { OrderRepository };
