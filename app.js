//require
const express = require("express");
const app = express();
const morgan = require("morgan");
var bodyParser = require("body-parser");
const mongoose = require("mongoose");

//routing
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const userRoutes = require("./routes/user");
mongoose.connect(
  "mongodb+srv://user1:user1@cluster0-7u6o9.mongodb.net/DB?retryWrites=true&w=majority",
  {
    useMongoClient: true
  }
);

//middleware
app.use("/uploads", express.static("uploads"));
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE");
    return res.status(200).json({});
  }
  next();
});

//middleware for handling requests
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);

//Error handling
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

//Exporting module
module.exports = app;
