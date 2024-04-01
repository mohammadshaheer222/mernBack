const { createCustomError } = require("../errors/custom-error");
const { asyncWrapper } = require("./async");
const jwt = require("jsonwebtoken");

const fetchUser = asyncWrapper(async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return next(
      createCustomError(
        "Unauthorized",
        "Please authenticate using valid login",
        401
      )
    );
  }
  const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  req.user = data.user;
  next();
});

module.exports = { fetchUser };
