const { asyncWrapper } = require("../middlewares/async");
const { createCustomError } = require("../errors/custom-error");
const Product = require("../models/productModel");

//GET
const getAllProduct = asyncWrapper(async (req, res) => {
  const { name, numericFields, sort, fields } = req.query;
  const queryObject = {};
  // searching with name
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }

  // filtering price
  if (numericFields) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    const regex = /\b(<|>|>=|=|<=)\b/g;
    let filters = numericFields.replace(
      regex,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ["new_price"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  const product = await Product.find(queryObject);
  res.status(200).json({ product });
  //sorting
  // let result = Product.find(queryObject);
  // if (sort) {
  //   const sortList = sort.split(",").join(" ");
  //   result = result.sort(sortList);
  // }

  // if (fields) {
  //   const fieldsList = fields.split(",").join(" ");
  //   result = result.select(fieldsList);
  // }

  // //pagination
  // const page = Number(req.query.page) || 1;
  // const limit = Number(req.query.limit) || 8;
  // const skip = (page - 1) * limit;
  // result = result.skip(skip).limit(limit);

  // const product = await result;
  // res.status(200).json({ success: true, nbHits: product.length, product });
});

//POST
const createProductImage = asyncWrapper(async (req, res) => {
  const images = [];
  for (const file of req.files) {
    const { filename } = file;
    images.push(`http://localhost:2000/images/${filename}`);
  }
  res.status(201).json({
    success: true,
    image: images,
  });
});

//POST
const createProduct = asyncWrapper(async (req, res, next) => {
  const { name, image, category, old_price, new_price } = req.body;
  if (!name || !image || !category || !old_price || !new_price) {
    return next(
      createCustomError("Validation Failed", "All fields are mandatory", 400)
    );
  }

  const product = await Product.create(req.body);
  return res.status(201).json({ success: true, product });
});

//GET

const getSingleProduct = asyncWrapper(async (req, res, next) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    return res.status(404).json({ msg: `No product with id: ${product}` });
  }
  res.status(200).json({ product });
});

//UPDATE
const updateProduct = asyncWrapper(async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    return res.status(404).json({ msg: `No product with id: ${product}` });
  }
  res.status(200).json({ product });
});

//DELETE
const deleteProduct = asyncWrapper(async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOneAndDelete({ _id: productId });
  if (!product) {
    return next(
      createCustomError("Not Found", `No product with id: ${productId}`, 404)
    );
  }
  res.status(200).json({ success: true, product });
});

const popularProducts = asyncWrapper(async (req, res) => {
  let product = await Product.find({ category: "women" });
  if (!product) {
    return next(
      createCustomError("Not Found", `No product with this category}`, 404)
    );
  }
  let popularProducts = product.slice(0).slice(-8);
  res.json({ status: true, popularProducts });
});

const newCollections = asyncWrapper(async (req, res) => {
  let product = await Product.find({});
  let newCollections = product.slice(1).slice(-8);
  res.json({ status: true, newCollections });
});

const recentlyViewed = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const idsArray = id.split(",");
  const recentlyViewedProducts = await Product.find({ _id: { $in: idsArray } });
  res.status(200).json({ status: true, recentlyViewedProducts });
});

module.exports = {
  getAllProduct,
  createProductImage,
  createProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  popularProducts,
  newCollections,
  recentlyViewed,
};
