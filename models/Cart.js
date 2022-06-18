const mongoose = require("mongoose");
const { Schema } = mongoose;

const cartSchema = Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    prod_id: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        required: true
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