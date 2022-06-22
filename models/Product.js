const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    image: {
        type: String,
        required: [true, "Image is required"]
    },
    price: {
        type: Number,
        required: [true, "Price is required"]
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