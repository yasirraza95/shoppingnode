const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    sub_cat_id: {
        type: Schema.Types.ObjectId,
        ref: "Subcategory"
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

module.exports = mongoose.model("Product", productSchema);