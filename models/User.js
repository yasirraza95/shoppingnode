const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var uniqueValidator = require("mongoose-unique-validator");

const userSchema = new Schema({
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
    reset_password_token: {
        type: String
    },
    type: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    },
    status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        default: "INACTIVE"
    }
},
{
    timestamps: true
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);