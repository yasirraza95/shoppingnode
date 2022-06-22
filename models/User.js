const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var uniqueValidator = require("mongoose-unique-validator");

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email already exists"]
    },
    phone: {
        type: Number,
        required: [true, "Phone is required"]
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: [true, "Username already exists"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
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