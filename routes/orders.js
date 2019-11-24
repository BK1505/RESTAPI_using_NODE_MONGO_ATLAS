const express = require("express");
const router = express.Router();
// const mongoose = require("mongoose");
// const Product = require("../models/product");
// const Orders = require("../models/order");
const checkAuth = require("../middleware/check-auth");
const OrderController = require("../controllers/orders");

router.get("/", checkAuth, OrderController.order_get_all);

router.post("/", checkAuth, OrderController.order_create_order);

router.get("/:orderId", checkAuth, OrderController.order_get_single_order);

router.delete("/:orderId", checkAuth, OrderController.order_delete_order);

module.exports = router;
