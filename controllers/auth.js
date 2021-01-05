const passport = require("passport");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateJWT = require('../middlewares/token');
const { body, validationResult } = require("express-validator");
const async = require('async');
const User = require("../models/users");

exports.login = 
[
  (req, res, next) => {
    passport.authenticate("local", {session: false}, (err, user, info) => {
      if(err) return res.status(400).json(err);
      if(!user) res.redirect(process.env.FRONTEND_URL);
      jwt.sign({user_id: user._id}, process.env.JWT_SECRET, (err, token) => {
        res.cookie('token', token);
        res.json({user, token});
      })
    })(req, res, next);
  },

]

exports.isLoggedIn = (req, res, next) => {
  if(req.user) {
    res.json({user_id: req.user.user_id});
  } else {
    res.sendStatus(401);
  }
}


exports.getUserToken = [
  passport.authenticate('jwt', {session: false}),
  (req, res, next) => {
    if(req.user) res.json(req.user);
    else res.redirect(process.env.FRONTEND_URL);
  }
]

exports.logout = (req, res, next) => {
  req.session.destroy(function (err) {
    res.sendStatus(200);
  });
}

exports.facebook_callback = 
(req, res, next) => {
  passport.authenticate('facebook', {session: false}, (err, user, info) => {
    if(err) return next(err);
    if(!user) return res.redirect(process.env.FRONTEND_URL)
    jwt.sign({user_id: user._id}, process.env.JWT_SECRET, (err, token) => {
      //res.cookie("token", token, {httpOnly: true});
      res.setHeader(`Set-Cookie`,  `token=${token}; Path=/; SameSite=None; Secure;`);
      return res.redirect(process.env.FRONTEND_URL);
    })
  })(req, res, next);
}

exports.register = [
  body("email")
    .isEmail()
    .withMessage("Invalid Email")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("first_name").trim().isLength({ min: 1 }).escape(),
  body("last_name").trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json(errors.array());

    const { email, first_name, last_name, password } = req.body;

    User.findOne({ email: email })
      .populate("friends")
      .exec((err, user) => {
        if (err) return res.status(400).json(err);
        if (user) return res.status(400).json({ message: "Email already in use" });

        bcrypt.hash(password, 10, (err, hash) => {
          if (err) return res.status(400).json(err);
          User.create(
            { email, first_name, last_name, password: hash, friends: ['5fcf4352afe8250880b947dd'] },
            (err, registeredUser) => {
              if (err) return res.status(400).json(err);
              // add this user to my friends list as well
              User.findOneAndUpdate({_id: '5fcf4352afe8250880b947dd'}, {$push: {friends: registeredUser._id}}, (err, doc) => {
                jwt.sign({user_id: registeredUser._id}, process.env.JWT_SECRET, (err, token) => {
                  if(err) return res.status(400).json(err);
                  res.json(token);
                })
              });
            }
          );
        });
      });
  },
]
