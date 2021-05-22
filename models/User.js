const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    information : {
      userName: {
        type: String,
        unique: true,
        required: true,
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
      password: {
        type: String,
        requried: true,
      },
      accountStatus: {
        type: String,
        default: 'active',
        enum: ['active', 'inactive'],
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
        default: 'Member',
      },
      sections: {
        type: [String],
        enum: ['Member', 'Admin'],
      },
      //Until the password is not changed, this value will be false on default.
      isPasswordChanged: {
        type: Boolean,
        default: false,
      },
      birthday: {
        type: Date,
      },
      address: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      }
    },
    diary: {
      
    }
  },
  { timestamps: true }
);

module.exports = User = mongoose.model('user', UserSchema);