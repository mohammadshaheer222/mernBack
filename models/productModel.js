const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    image: {
      type: [String],
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    new_price: {
      type: Number,
      required: true,
    },

    old_price: {
      type: Number,
      required: true,
    },
    
    available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("All-Product", ProductSchema);
