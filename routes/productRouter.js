const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  getAllProduct,
  createProductImage,
  createProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  popularProducts,
  newCollections,
  recentlyViewed,
} = require("../controllers/productController");
const storage = require("../middlewares/file-upload");
const upload = multer({ storage: storage });

router.route("/upload").post(upload.array("image", 4), createProductImage);
router.route("/").get(getAllProduct).post(createProduct);
router.route("/popularProducts").get(popularProducts);
router.route("/newCollections").get(newCollections);
router.route("/:id").get(getSingleProduct).patch(updateProduct).delete(deleteProduct);
router.route("/recentlyViewed/:id").get(recentlyViewed);
module.exports = router;
