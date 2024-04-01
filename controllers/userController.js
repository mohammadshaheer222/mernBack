const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const { createCustomError } = require("../errors/custom-error");
const { asyncWrapper } = require("../middlewares/async");
const { hashPassword, comparePassword } = require("../helpers/auth");
const { sendEmail } = require("../helpers/sendEmail");

//signup
const signUp = asyncWrapper(async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return next(
      createCustomError("Validation Error", "All fields are mandatory", 403)
    );
  }

  if (password.length < 6) {
    return next(
      createCustomError(
        "Validation Error",
        "Password is required and should be atleast 6 characters long",
        403
      )
    );
  }
  const user = await User.findOne({ email });
  if (user) {
    return next(
      createCustomError("Validation Error", "Email already registered", 403)
    );
  }

  const cart = {};
  const wishList = {};
  for (let i = 0; i <= 300 + 1; i++) {
    cart[i] = 0;
    wishList[i] = 0;
  }

  const hashedPassword = await hashPassword(password);
  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
    cartData: cart,
    wishList: wishList,
  });
  if (newUser) {
    return res
      .status(201)
      .json({ success: true, id: newUser._id, email: newUser.email });
  }
});

//login
const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(
      createCustomError("Validation Failed", "All fields are mandatory", 403)
    );
  }
  const user = await User.findOne({ email });
  if (user && (await comparePassword(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user._id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET
    );
    return res.status(200).json({ success: true, accessToken });
  } else {
    return next(
      createCustomError("Not Found", "Email or Password is not valid", 404)
    );
  }
});

//forgot Password
const forgotPassword = asyncWrapper(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(
      createCustomError("Validation Error", "Email field required", 403)
    );
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(createCustomError("Not Found", "User is not registered", 404));
  }

  const accessToken = jwt.sign(
    { id: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "5m" }
  );

  const message = await sendEmail(email, accessToken);
  res.status(200).json({ success: true, message: message });
});

//reset Password
const resetPassword = asyncWrapper(async (req, res, next) => {
  const { accessToken } = req.params;
  const { password } = req.body;
  if (!password) {
    return next(
      createCustomError("Validation Error", "Password field required", 403)
    );
  }
  const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  if (!decoded) {
    return next(createCustomError("Unauthorized", "Not verified", 401));
  }
  const id = decoded.id;
  const hashedPassword = await hashPassword(password);
  const updatedPassword = await User.findByIdAndUpdate(
    { _id: id },
    { password: hashedPassword }
  );
  res.status(201).json({ success: true, message: "Password updated" });
});

module.exports = {
  signUp,
  login,
  forgotPassword,
  resetPassword,
};
