class CustomAPIError extends Error {
  constructor(title, message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.title = title;
  }
}

const createCustomError = (title, message, statusCode) => {
  return new CustomAPIError(title, message, statusCode);
};

module.exports = { CustomAPIError, createCustomError };
