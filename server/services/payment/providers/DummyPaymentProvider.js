class DummyPaymentProvider {
  async charge({ amount, customer, method }) {
    if (!amount || amount <= 0) {
      const error = new Error("Payment amount must be greater than zero");
      error.statusCode = 400;
      throw error;
    }

    if (method === "fail") {
      const error = new Error("Dummy payment failed");
      error.statusCode = 402;
      throw error;
    }

    return {
      provider: "dummy",
      paymentId: `pay_${Date.now()}`,
      status: "captured",
      amount,
      customer,
      method: method || "dummy-card",
    };
  }
}

module.exports = { DummyPaymentProvider };
