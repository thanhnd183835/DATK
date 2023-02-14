const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "default-avatar.png",
    },
    role: {
      type: Number,
      default: 0,
      required: true,
      // 0: user, 1: admin,
    },
    status: {
      type: Number,
      default: 0,
      enum: [
        0, // chua cap nhat trang thai
        1, //thanh cong
        2, //that bai
      ],
    },
    transactions:[{transactionId:{type: ObjectId, ref:'Transaction'}}],
    active: {
      type: Boolean,
      default: false,
    },
    createAt: Date,
  },

  { timestamps: true }
);

var User = mongoose.model("User", userSchema, "User");
module.exports = User;
