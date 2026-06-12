class PaymentService {
  constructor(paymentProvider) {
    this.paymentProvider = paymentProvider;
  }

  async collectPayment({ amount, customer, method, orderId }) {
    const payment = await this.paymentProvider.charge({ amount, customer, method });

    return payment;
  }
}

module.exports = { PaymentService };
