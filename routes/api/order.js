const OrderController = require("../../controllers/order_controller");

module.exports = function (router) {
  router.post("/order", OrderController.createOrder);
  router.get("/orders", OrderController.findOrdersByQuery);
};
