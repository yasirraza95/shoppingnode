const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    address: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
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
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            total_price: {
                type: Number,
                required: true
            },
        }
    ]
},
{
    timestamps: true
});

module.exports = mongoose.modal("Orders", orderSchema);