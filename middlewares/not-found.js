const notFound = (req, res) => {
  res.status(404).json({ message: "Requested route is not found" });
};

module.exports = { notFound };
