const express = require("express");
const router = express.Router();
const {
  incrementCart,
  decrementCart,
  removeCart,
  getCartItem,
} = require("../controllers/cartController");
const { fetchUser } = require("../middlewares/addtocart");

router.route("/incrementcart").post(fetchUser, incrementCart);
router.route("/decrementcart").post(fetchUser, decrementCart);
router.route("/removecart").post(fetchUser, removeCart);
router.route("/getcartitem").get(fetchUser, getCartItem);

module.exports = router;
