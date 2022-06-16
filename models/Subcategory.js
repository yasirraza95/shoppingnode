const mongoose = require("mongoose");
const { Schema } = mongoose;

const subcategorySchema = Schema({
    name: {
        type: String,
        required: true
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

module.exports = mongoose.modal("Subcategory", subcategorySchema);