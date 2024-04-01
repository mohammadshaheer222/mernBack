const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, "../public/images"));
  },
  filename: (req,file,callback) => {
    callback(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
  }
});

module.exports = storage;