const mongoose = require("mongoose");
const { Schema } = mongoose;
const { v4: uuidv4 } = require("uuid");

const refreshTokenSchema = new mongoose.Schema(
  {
    token: String,
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    expiry_date: Date,
  },
  {
    timestamps: true,
  }
);

refreshTokenSchema.statics.verifyExpiration = (token) => {
  return token.expiry_date.getTime() < new Date().getTime();
};

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);
module.exports = RefreshToken;
