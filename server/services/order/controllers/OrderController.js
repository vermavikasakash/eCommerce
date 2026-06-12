class OrderController {
  constructor(orderService) {
    this.orderService = orderService;
  }

  list = async (req, res) => {
    const orders = await this.orderService.listOrders(req.customerId);

    res.status(200).send({
      success: true,
      orders,
    });
  };

  create = async (req, res) => {
    const order = await this.orderService.createOrder(req.customerId, req.body);

    res.status(201).send({
      success: true,
      message: "Order placed successfully",
      order,
    });
  };
}

module.exports = { OrderController };
