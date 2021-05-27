const express = require("express");
const router = express.Router();
const config = require("config");
const moment = require("moment");
const { Magic } = require('@magic-sdk/admin');
const User = require("../../models/User");
const magic = new Magic(process.env.magic_api_key_secret);
const jwt = require('jsonwebtoken');
const passport = require('passport');

// @route   GET api/users
// @desc    Gets all the users from the DB
// @access  Public
router.get("/", async (req, res) => {
  try {
    const allUsers = await User.find();
    res.status(200).json({msg: "success", allUsers});
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "Server Error" });
  }
});

// @route   POST api/users/add
// @desc    add a user in DB
// @access  Private
router.post('/add', async (req, res) => {
  const body = req.body;
  try{
    const user = new User(body);
    user.save();
    res.status(200).json(user);
  } catch(err){
      res.status(400).json({"error":err})
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

// @route   POST api/users/login
// @desc    logs in users by DIDToken
// @access  Private
router.post("/login", async (req, res) => {
  try {
    const DidToken = magic.utils.parseAuthorizationHeader(
      req.headers.authorization
    );
    const user = await magic.users.getMetadataByToken(DidToken);
    
    //generate token
    const sub = '123abc';
    const token = jwt.sign({
        "iss": "DiaryServer",
        "exp": Math.floor(Date.now()/1000) + (60*5),
        "sub": sub,
        "nonce": Math.random().toString(36).substring(2,15) + Math.random().toString(36).substring(2,15)
    }, process.env.jwtSecret)

    //set cookies here
    let options = {
      maxAge: 1000 * 60 * 15, // would expire after 15 minutes
      httpOnly: true, // The cookie only accessible by the web server
      signed: true, // Indicates if the cookie should be signed
    };

    res.cookie("token", token, options);
    res.cookie("authed", true, { httpOnly: false });
    
    res.status(200).end();
  } catch (err) {
    console.log("Error in server",err);
    res.status(500).json({ msg: "Server error", err });
  }
});

module.exports = router;
