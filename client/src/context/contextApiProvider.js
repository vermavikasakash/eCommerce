import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  addCartItemFunction,
  createOrderFunction,
  getCartFunction,
  getOrdersFunction,
  removeCartItemFunction,
  updateCartItemFunction,
} from "../serviceApi/servicesApi";
import { getSocket } from "../serviceApi/socketClient";

const ContextApi = createContext();

const emptyCart = {
  items: [],
  total: 0,
};

const ContextProvider = ({ children }) => {
  const [cart, setCart] = useState(emptyCart);
  const [orders, setOrders] = useState([]);
  const [realtimeStatus, setRealtimeStatus] = useState("connecting");

  const refreshCart = async () => {
    const result = await getCartFunction();
    setCart(result.data.cart);
  };

  const refreshOrders = async () => {
    const result = await getOrdersFunction();
    setOrders(result.data.orders);
  };

  const addToCart = async (product) => {
    const result = await addCartItemFunction(product.id, 1);
    setCart(result.data.cart);
    toast.success("Item added to cart");
  };

  const updateCartItem = async (productId, quantity) => {
    const result = await updateCartItemFunction(productId, quantity);
    setCart(result.data.cart);
  };

  const removeCartItem = async (productId) => {
    const result = await removeCartItemFunction(productId);
    setCart(result.data.cart);
  };

  const placeOrder = async (checkoutPayload) => {
    const result = await createOrderFunction(checkoutPayload);
    setOrders((currentOrders) => [result.data.order, ...currentOrders]);
    return result.data.order;
  };

  useEffect(() => {
    refreshCart();
    refreshOrders();

    const socket = getSocket();
    socket.on("connect", () => setRealtimeStatus("connected"));
    socket.on("disconnect", () => setRealtimeStatus("disconnected"));
    socket.on("cart:updated", (payload) => setCart(payload.cart));
    socket.on("order:created", (payload) =>
      setOrders((currentOrders) => {
        const exists = currentOrders.some((order) => order.id === payload.order.id);
        return exists ? currentOrders : [payload.order, ...currentOrders];
      })
    );
    socket.on("payment:completed", () => toast.success("Payment captured"));

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("cart:updated");
      socket.off("order:created");
      socket.off("payment:completed");
    };
  }, []);

  const value = useMemo(
    () => ({
      cart,
      orders,
      realtimeStatus,
      cartCount: cart.items.reduce((total, item) => total + item.quantity, 0),
      refreshCart,
      refreshOrders,
      addToCart,
      updateCartItem,
      removeCartItem,
      placeOrder,
    }),
    [cart, orders, realtimeStatus]
  );

  return <ContextApi.Provider value={value}>{children}</ContextApi.Provider>;
};

const useGlobalData = () => useContext(ContextApi);

export { ContextProvider, useGlobalData };
