const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    information : {
      username: {
        type: String,
        unique: true,
        required: true,
      },
      fullname: {
        type: String,
        required: true,
      },
      contactnumber: {
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
      inactivated_date: {
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