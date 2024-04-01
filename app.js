const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

const { connectDb } = require("./Db/connectDb");
const { notFound } = require("./middlewares/not-found");
const { errorHandlerMiddleware } = require("./middlewares/errorHandler");
const productRouter = require("./routes/productRouter");
const userRouter = require("./routes/userRouter");
const cartRouter = require("./routes/cartRouter");
const wishListRouter = require("./routes/wishListRouter");

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

app.use(express.static("public"));
app.use("/api/v1/allproducts", productRouter);
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/wishlist", wishListRouter);

app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 2222;
const start = async () => {
  try {
    await connectDb(process.env.MONGO_URL);
    app.listen(2000, () =>
      console.log(`Connected to Db and Server is listening on Port ${port}`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
