const { createCustomError } = require("../errors/custom-error");
const { asyncWrapper } = require("../middlewares/async");
const User = require("../models/userModel")

//POST- increment cart item
const incrementCart = asyncWrapper(async (req, res, next) => {
  const userData = await User.findOne({ _id: req.user.id });
  if (!userData) {
    return next(createCustomError("Not Found", "User not found", 404));
  }

  const itemId = req.body.itemId;
  userData.cartData[itemId] = (userData.cartData[itemId] || 0) + 1;

  // userData.markModified("cartData");
  // const updatedUser = await userData.save();
  const user = await User.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );

  res.status(201).json({ success: true, user: user });
});

//POST- decrement cart
const decrementCart = asyncWrapper(async (req, res, next) => {
  const userData = await User.findOne({ _id: req.user.id });
  if (!userData) {
    return next(createCustomError("Not Found", "User not found", 404));
  }
  const itemId = req.body.itemId;
  if (userData.cartData[itemId] && userData.cartData[itemId] > 0) {
    userData.cartData[itemId] -= 1;
  } else {
    return next(
      createCustomError("Bad Request", "Item quantity cannot be negative", 400)
    );
  }
  const user = await User.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );

  res.status(201).json({ success: true, user: user });
});

//POST- remove cart
const removeCart = asyncWrapper(async (req, res, next) => {
  const userData = await User.findOne({ _id: req.user.id });
  if (!userData) {
    return next(createCustomError("Not Found", "User not found", 404));
  }
  const itemId = req.body.itemId;
  if (userData.cartData[itemId] && userData.cartData[itemId] > 0) {
    delete userData.cartData[itemId];
  } else {
    return next(
      createCustomError("Bad Request", "Item quantity cannot be negative", 400)
    );
  }
  const user = await User.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );

  res.status(201).json({ success: true, user: user });
});

//get item
const getCartItem = asyncWrapper(async (req, res, next) => {
  const userData = await User.findOne({ _id: req.user.id });
  if (!userData) {
    return next(createCustomError("Not Found", "User not found", 404));
  }
  res.status(200).json(userData.cartData);
});

module.exports = {incrementCart, decrementCart, removeCart, getCartItem}