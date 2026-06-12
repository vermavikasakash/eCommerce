class ProductController {
  constructor(productService) {
    this.productService = productService;
  }

  list = async (req, res) => {
    const products = await this.productService.listProducts();

    res.status(200).send({
      success: true,
      message: "Products fetched successfully",
      products,
    });
  };

  getById = async (req, res) => {
    const product = await this.productService.getProduct(req.params.productId);

    res.status(200).send({
      success: true,
      product,
    });
  };
}

module.exports = { ProductController };
