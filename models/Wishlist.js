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
    
},
{
    timestamps: true
});

module.exports = mongoose.modal("Cart", cartSchema);