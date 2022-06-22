const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    address: {
        type: String,
        required: [true, "Address is required"]
    },
    date: {
        type: Date,
        default: Date.now
    },
    email: {
        type: String,
        required: [true, "Email is required"]
    },
    phone: {
        type: Number,
        required: [true, "Phone is required"]
    },
    price: {
        type: Number
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    order_detail: [
        {
            prod_id: {
                type: Schema.Types.ObjectId,
                ref: "Product"
            },
            quantity: {
                type: Number,
                required: [true, "Quantity is required"]
            },
            price: {
                type: Number,
                required: [true, "Price is required"]
            },
            total_price: {
                type: Number,
                required: [true, "Total Price is required"]
            },
        }
    ]
},
{
    timestamps: true
});

module.exports = mongoose.model("Orders", orderSchema);