const mongoose = require("mongoose");
const { Schema } = mongoose;

const wishlistSchema = Schema({
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
    
},
{
    timestamps: true
});

module.exports = mongoose.model("Wishlist", wishlistSchema);