import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API || "http://localhost:8080";
const CUSTOMER_KEY = "ecommerce_customer_id";

const getCustomerId = () => {
  const existingCustomerId = localStorage.getItem(CUSTOMER_KEY);
  if (existingCustomerId) return existingCustomerId;

  const customerId = `web_${Date.now()}`;
  localStorage.setItem(CUSTOMER_KEY, customerId);
  return customerId;
};

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

apiClient.interceptors.request.use((config) => ({
  ...config,
  headers: {
    ...config.headers,
    "x-customer-id": getCustomerId(),
  },
}));

const getProductsFunction = () => apiClient.get("/products");
const getCartFunction = () => apiClient.get("/cart");
const addCartItemFunction = (productId, quantity = 1) =>
  apiClient.post("/cart/items", { productId, quantity });
const updateCartItemFunction = (productId, quantity) =>
  apiClient.patch(`/cart/items/${productId}`, { quantity });
const removeCartItemFunction = (productId) => apiClient.delete(`/cart/items/${productId}`);
const clearCartFunction = () => apiClient.delete("/cart");
const createOrderFunction = (payload) => apiClient.post("/orders", payload);
const getOrdersFunction = () => apiClient.get("/orders");

export {
  API_BASE_URL,
  getCustomerId,
  getProductsFunction,
  getCartFunction,
  addCartItemFunction,
  updateCartItemFunction,
  removeCartItemFunction,
  clearCartFunction,
  createOrderFunction,
  getOrdersFunction,
};
