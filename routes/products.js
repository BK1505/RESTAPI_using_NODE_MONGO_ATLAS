const express = require("express");
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");
const ProductController = require("../controllers/products");

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 15 },
  fileFilter: fileFilter
});

router.get("/", ProductController.product_get_all);

router.post(
  "/",
  checkAuth,
  upload.single("productImage"),
  ProductController.product_create_product
);

router.get("/:productId", ProductController.product_get_single);

router.patch("/:productId", checkAuth, ProductController.prouct_patch);

router.delete("/:productId", checkAuth, ProductController.product_delete);

module.exports = router;
