const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    order_detail: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product id is required"],
        },
        name: {
          type: String,
          required: [true, "Name is required"],
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
        },
        image: {
          type: String,
          required: [true, "Image is required"],
        },
        price: {
          type: Number,
          required: [true, "Price is required"],
        },
        total_price: {
          type: Number,
          required: [true, "Total Price is required"],
        },
      },
    ],
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    phone: {
      type: Number,
      required: [true, "Phone is required"],
    },
    price: {
      type: Number,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User id is required"]
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Orders", orderSchema);
