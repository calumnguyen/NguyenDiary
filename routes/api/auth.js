const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { Magic } = require("@magic-sdk/admin");
const User = require("../../models/User");
const magic = new Magic(process.env.magic_api_key_secret);

// @route   GET api/auth
// @desc    Verify token and get User
// @access  Private
router.get("/", auth, async (req, res) => {
  try {    
    const user = await User.findOne({ "information.email": req.email });
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "Server Error" });
  }
});

// @route   POST api/auth
// @desc    Authenticate User and get Token
// @access  Public
router.post("/", async (req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions

  try {
    const DidToken = magic.utils.parseAuthorizationHeader(
      req.headers.authorization
    );
    const user = await magic.users.getMetadataByToken(DidToken);

    //check if the user exists in the DB
    const userInDB = await User.findOne({ "information.email": user.email });
    if (userInDB) {
      //generate token
      const sub = "123abc";
      const token = jwt.sign(
        {
          ...user,
          exp: Math.floor(Date.now() / 1000) + 60 * 5,
          sub: sub,
          nonce:
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15),
        },
        process.env.jwtSecret
      );

      res.status(200).json({ token });
    } else {
      return res.status(403).json({
        errors: [
          {
            msg: `Sorry! User Does not exists.`,
          },
        ],
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
});

module.exports = router;
