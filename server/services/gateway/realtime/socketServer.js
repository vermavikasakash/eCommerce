const { Server } = require("socket.io");
const { env } = require("../../shared/config/env");
const eventBus = require("../../shared/utils/eventBus");

const attachSocketServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: env.clientOrigin,
      methods: ["GET", "POST", "PATCH", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    const customerId = socket.handshake.query.customerId || "guest-customer";
    socket.join(customerId);
    socket.emit("gateway:connected", {
      message: "Connected to ecommerce realtime gateway",
      customerId,
    });
  });

  eventBus.on("cart.updated", (payload) => {
    io.to(payload.customerId).emit("cart:updated", payload);
  });

  eventBus.on("order.created", (payload) => {
    io.to(payload.customerId).emit("order:created", payload);
  });

  eventBus.on("payment.completed", (payload) => {
    io.to(payload.customerId).emit("payment:completed", payload);
  });

  return io;
};

module.exports = { attachSocketServer };
