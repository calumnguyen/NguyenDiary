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
    const allUsers = await User.find({}, { "information.fullName": 1, "information.email":1, "information.avatar":1 });
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

// @route   POST api/users/update/:userId
// @desc    Updates user info
// @access  Private
router.post("/update/:userId", auth, async (req, res) => {
  try {
    const userId = req.params.userId;
    await User.updateOne(
      { _id: userId },
      {
        $set: {
          information: req.body.information,
        },
      }
    );
    res.status(200).json({ msg: "User Info updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
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
    //delete previous profile image from Cloudinary
    prevAvatar = prevAvatar.information.avatar;
    if (prevAvatar) {
      let prevAvatarName = prevAvatar.substring(
        prevAvatar.lastIndexOf("/") + 1
      );
      let prevAvatarNameWithoutExtension = prevAvatarName.substring(
        0,
        prevAvatarName.indexOf(".")
      );
      await cloudinary.v2.uploader.destroy(
        prevAvatarNameWithoutExtension,
        function (error, result2) {
          if (error) {
            res
              .status(500)
              .json({ errors: [{ msg: "Could not update the image" }] });
          }
        }
      );
      await cloudinary.uploader.upload(
        req.body.updatedImage,
        async function (result) {
          await User.updateOne(
            { _id: req.body.userId },
            {
              $set: {
                "information.avatar": result.secure_url,
              },
            }
          );

          res.status(200).json({ msg: "Profile Image upadated successfully" });
        }
      );
    } else {
      await cloudinary.uploader.upload(
        req.body.updatedImage,
        async function (result) {
          await User.updateOne(
            { _id: req.body.userId },
            {
              $set: {
                "information.avatar": result.secure_url,
              },
            }
          );

          res.status(200).json({ msg: "Profile Image upadated successfully" });
        }
      );
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
});

// @route   POST api/users/update-diary
// @desc    Updates or Inserts Answers for the given day
// @access  Private
router.post("/update-diary", auth, async (req, res) => {
  try {
    const userId = req.body.userId;
    const day = req.body.day;
    const ans1 = req.body.ans1;
    const ans2 = req.body.ans2;
    const ans3 = req.body.ans3;
    const ans4 = req.body.ans4;
    const ans5 = req.body.ans5;

    //check if the diary for given date exists
    let ifDateExists = await User.findOne(
      { _id: userId, "diary.day": day },
      { _id: 1 }
    );
    if (ifDateExists) {
      await User.updateOne(
        { _id: userId, "diary.day": day },
        {
          $set: {
            "diary.$.ans1": ans1,
            "diary.$.ans2": ans2,
            "diary.$.ans3": ans3,
            "diary.$.ans4": ans4,
            "diary.$.ans5": ans5,
          },
        }
      );
    } else {
      let diaryObj = { day, ans1, ans2, ans3, ans4, ans5 };
      await User.updateOne(
        { _id: userId },
        {
          $push: { diary: diaryObj },
        }
      );
    }
    res.status(200).json({ msg: "Diary saved successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
});

// @route   Get api/users/get-diary/:day
// @desc    Get answers for the given day
// @access  Private
router.get("/get-diary/:userId/:day", auth, async (req, res) => {
  try {
    const userId = req.params.userId;
    const day = req.params.day;
    //check if the diary for given date exists
    let ifDateExists = await User.findOne(
      { _id: userId, "diary.day": day },
      { _id: 1 }
    );
    let allAnswers = null;
    if (ifDateExists) {
      allAnswers = await User.findOne(
        { _id: userId, "diary.day": day },
        {
          _id: 0,
          diary: { $elemMatch: { day: day } },
        }
      );
      res.status(200).json({ allAnswers, msg: "answers fetched successfully" });
    } else {
      res.status(200).json({ allAnswers, msg: "Given day does not exists" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
});

// @route   Get api/users/get-diary-dates/:userId
// @desc    Get exisiting diary dates for the given userId
// @access  Private
router.get("/get-diary-dates/:userId", auth, async (req, res) => {
  try {
    const userId = req.params.userId;
    let allDates = null;
    allDates = await User.findOne(
      { _id: userId },
      {
        _id: 0,
        "diary.day": 1,
      }
    );
    res.status(200).json({ allDates, msg: "dates fetched successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
});

// @route   Get api/users/:userId
// @desc    Get Used by _id
// @access  Private
router.get("/:userId", auth, async (req, res) => {
  try {
    const userId = req.params.userId;
    let user = await User.findOne(
      { _id: userId },
      {
        information: 1
      }
    );
    res.status(200).json({ user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
});

module.exports = router;
