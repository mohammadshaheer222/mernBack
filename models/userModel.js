const mongoose = require("mongoose");

const UserModel = new mongoose.Schema({
  username: {
    type: String,
    uniquie: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  wishList: {
    type: Object,
  }
});

module.exports = mongoose.model("shopping-user", UserModel);
