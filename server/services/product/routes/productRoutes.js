const express = require("express");
const { asyncHandler } = require("../../shared/utils/asyncHandler");
const { ProductController } = require("../controllers/ProductController");
const { ProductRepository } = require("../repositories/ProductRepository");
const { ProductService } = require("../services/ProductService");

const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

const productRouter = express.Router();

productRouter.get("/", asyncHandler(productController.list));
productRouter.get("/:productId", asyncHandler(productController.getById));

module.exports = { productRouter, productService };
