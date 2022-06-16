const mongoose = require("mongoose");
const { Schema } = mongoose;
var uniqueValidator = require("mongoose-unique-validator");

const userSchema = Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["USER", "ADMIN"]
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

userSchema.plugin(uniqueValidator);
module.exports = mongoose.modal("User", userSchema);