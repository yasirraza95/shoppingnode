const mongoose = require("mongoose");
const { Schema } = mongoose;

const wishlistSchema = Schema({
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

module.exports = mongoose.model("Wishlist", wishlistSchema);