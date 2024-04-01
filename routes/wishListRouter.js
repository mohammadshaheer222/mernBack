const express = require("express");
const router = express.Router();
const {
  addWishList,
  removeWishList,
  getWishList,
} = require("../controllers/wishListController");
const { fetchUser } = require("../middlewares/addtocart");

router.route("/addwhishlist").post(fetchUser, addWishList);
router.route("/removewhishlist").post(fetchUser, removeWishList);
router.route("/getwishlist").get(fetchUser, getWishList);

module.exports = router;
