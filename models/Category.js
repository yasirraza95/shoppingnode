const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = Schema({
    name: {
        type: String,
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

module.exports = mongoose.model("Category", categorySchema);