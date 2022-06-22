const mongoose = require("mongoose");
const { Schema } = mongoose;

const cartSchema = Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"]
    },
    prod_id: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product is required"]
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"]
    },
    status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        default: "ACTIVE"
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("Cart", cartSchema);