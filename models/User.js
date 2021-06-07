const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    information: {
      userName: {
        type: String,
        unique: true,
        required: true,
      },
      tagline: {
        type: String,
      },
      fullName: {
        type: String,
        required: true,
      },
      contactNumber: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      gender: {
        type: String,
        required: true,
      },
      accountStatus: {
        type: String,
        default: "active",
        enum: ["active", "inactive"],
      },
      inactivatedDate: {
        type: Date,
      },
      avatar: {
        type: String,
      },
      userID: {
        type: Number,
      },
      systemRole: {
        type: String,
        default: "Member",
      },
      sections: {
        type: [String],
        enum: ["Member", "Admin"],
      },
    },
    diary: [
      {
        day: {
          type: String,
          required: true
        },
        ans1: {
          type: String,
        },
        ans2: {
          type: String,
        },
        ans3: {
          type: String,
        },
        ans4: {
          type: String,
        },
        ans5: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = User = mongoose.model("user", UserSchema);
