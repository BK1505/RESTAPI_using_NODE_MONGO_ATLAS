const mongoose = require("mongoose");
const Product = require("../models/product");
const Orders = require("../models/order");

exports.order_get_all = (req, res, next) => {
  Orders.find()
    .select("product quantity _id")
    .populate("product", "name")
    .exec()
    .then(docs => {
      const resp = {
        count: docs.length,
        orders: docs.map(doc => {
          return {
            product: doc.product,
            quantity: doc.quantity,
            _id: doc._id
            // request: {
            //   type: "GET",
            //   url: "http://localhost:3000/products/" + doc._id
            // }
          };
        })
      };
      res.status(200).json(resp);
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

exports.order_create_order = (req, res, next) => {
  Product.findById(req.body.productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({
          message: "product not found"
        });
      }
      const order = new Orders({
        _id: new mongoose.Types.ObjectId(),
        product: req.body.productId,
        quantity: req.body.quantity
      });
      return order.save();
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Order created",
        Order: result
        // createdOrder: {
        //   name: result.name,
        //   price: result.price,
        //   _id: result._id,
        //   request: {
        //     type: "GET",
        //     url: "http://localhost:3000/products/" + result._id
        //   }
        // }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.order_get_single_order = (req, res, next) => {
  const id = req.params.orderId;
  Orders.findById(id)
    .select("product quantity _id")
    .populate("product", "name price _id")
    .exec()
    .then(result => {
      if (result) {
        res.status(200).json({
          order: result
        });
      } else {
        res.status(404).json({
          message: "Order not found"
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.order_delete_order = (req, res, next) => {
  Orders.remove({ _id: req.params.orderId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Order Deleted"
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};
