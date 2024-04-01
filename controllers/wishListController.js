const { createCustomError } = require("../errors/custom-error");
const { asyncWrapper } = require("../middlewares/async");
const User = require("../models/userModel");

const addWishList = asyncWrapper(async (req, res, next) => {
  const userData = await User.findOne({ _id: req.user.id });
  if (!userData) {
    return next(createCustomError("Not Found", "User not found", 404));
  }

  const itemId = req.body.itemId;
  userData.wishList[itemId] = 1;

  const user = await User.findOneAndUpdate(
    { _id: req.user.id },
    { wishList: userData.wishList }
  );

  res.status(201).json({ success: true, user: user });
});

const removeWishList = asyncWrapper(async (req, res, next) => {
  const userData = await User.findOne({ _id: req.user.id });
  if (!userData) {
    return next(createCustomError("Not Found", "User not found", 404));
  }

  const itemId = req.body.itemId;
  delete userData.wishList[itemId];

  const user = await User.findOneAndUpdate(
    { _id: req.user.id },
    { wishList: userData.wishList }
  );

  res.status(201).json({ success: true, user: user });
});

const getWishList = asyncWrapper(async (req, res, next) => {
  const userData = await User.findOne({ _id: req.user.id });
  if (!userData) {
    return next(createCustomError("Not Found", "User not found", 404));
  }
  res.status(200).json(userData.wishList);
});

module.exports = { addWishList, removeWishList, getWishList };
