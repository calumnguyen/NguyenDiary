const express = require("express");
const router = express.Router();
const config = require("config");
const moment = require("moment");
const { Magic } = require("@magic-sdk/admin");
const User = require("../../models/User");
const magic = new Magic(process.env.magic_api_key_secret);
const jwt = require("jsonwebtoken");
const passport = require("passport");
const auth = require("../../middleware/auth");
const cloudinary = require("cloudinary");

// cloundinary configuration
cloudinary.config({
  cloud_name: config.get("cloud_name"),
  api_key: config.get("api_key"),
  api_secret: config.get("api_secret"),
});

// @route   GET api/users
// @desc    Gets all the users from the DB
// @access  Public
router.get("/", async (req, res) => {
  try {
    const allUsers = await User.find();
    res.status(200).json({ msg: "success", allUsers });
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "Server Error" });
  }
});

// @route   POST api/users/add
// @desc    add a user in DB
// @access  Private
router.post("/add", auth, async (req, res) => {
  const body = req.body;
  try {
    const user = new User(body);
    user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

// @route   POST api/users/logout
// @desc    logs out users by DIDToken
// @access  Private
router.post("/logout", async (req, res) => {
  const DidToken = magic.utils.parseAuthorizationHeader(
    req.headers.authorization
  );
  await mAdmin.users.logoutByToken(DIDToken);
  //delete cookies and redirect to login page
});

// @route   POST api/users/edit-image
// @desc    Updates user image
// @access  Private
router.post("/edit-image", auth, async (req, res) => {
  try {
    // default male image: 'https://res.cloudinary.com/hw93eukdo/image/upload/v1610526077/male_iypciz.png';
    // default female image: 'https://res.cloudinary.com/hw93eukdo/image/upload/v1610526077/female_rmmbsp.png';
    // default others image: 'https://res.cloudinary.com/hw93eukdo/image/upload/v1610526077/other_mxpm4r.png';

    //get previous avatar
    let prevAvatar = await User.findOne(
      {
        _id: req.body.userId,
      },
      { information: 1 }
    );

    prevAvatar = prevAvatar.information.avatar;
    let prevAvatarName = prevAvatar.substring(prevAvatar.lastIndexOf("/") + 1);
    let prevAvatarNameWithoutExtension = prevAvatarName.substring(
      0,
      prevAvatarName.indexOf(".")
    );

    cloudinary.uploader.upload(req.body.updatedImage, async function (result) {
      await User.updateOne(
        { _id: req.body.userId },
        {
          $set: {
            "information.avatar": result.secure_url,
          },
        }
      );
      //destory previous image
      await cloudinary.v2.uploader.destroy(
        prevAvatarNameWithoutExtension,
        function (error, result2) {
          if(error){
            res.status(500).json({ errors: [{ msg: "Could not save the image" }] });
          }
        }
      );
      res.status(200).json({ msg: "Profile Image upadated successfully" });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
});

module.exports = router;
