const express = require("express");
const router = express.Router();
const {
  signUp,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");

router.route("/signup").post(signUp);
router.route("/login").post(login);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:accessToken").post(resetPassword);

module.exports = router;
