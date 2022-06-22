const mongoose = require("mongoose");
const { Schema } = mongoose;

const subcategorySchema = Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    cat_id: {
        type: Schema.Types.ObjectId,
        ref: "Category"
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

module.exports = mongoose.model("Subcategory", subcategorySchema);