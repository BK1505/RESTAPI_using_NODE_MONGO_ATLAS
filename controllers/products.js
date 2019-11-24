const mongoose = require("mongoose");
const Products = require("../models/product");

exports.product_get_all = (req, res, next) => {
  Products.find()
    .select("name price _id productImage")
    .exec()
    .then(docs => {
      const resp = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            productImage: doc.productImage,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id
            }
          };
        })
      };
      res.status(200).json(resp);
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

exports.product_create_product = (req, res, next) => {
  console.log(req.file);
  const product = new Products({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  });
  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Product created",
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          productImage: result.productImage,
          request: {
            type: "GET",
            url: "http://localhost:3000/products/" + result._id
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.product_get_single = (req, res, next) => {
  const id = req.params.productId;
  Products.findById(id)
    .select("name price _id productImage")
    .exec()
    .then(doc => {
      console.log("from db", doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({ message: "No valid entry found" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.prouct_patch = (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops in req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Products.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Product updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.product_delete = (req, res, next) => {
  const id = req.params.productId;
  Products.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Product deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
