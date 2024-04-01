const { CustomAPIError } = require("../errors/custom-error");

const errorHandlerMiddleware = (error, req, res, next) => {
  if (error instanceof CustomAPIError) {
    return res.status(error.statusCode).json({title:error.title, message: error.message });
  }
  return res
    .status(500)
    .json({ message: "Internal Server Error! Please try again" });
};

module.exports = { errorHandlerMiddleware };
