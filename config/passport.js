const passport = require("passport");
const bcrypt = require("bcrypt");
const JWTStrategy = require("passport-jwt").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

const ExtractJWT = require("passport-jwt").ExtractJwt;

const User = require("../models/users");

passport.use(
  new JWTStrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    (user, done) => {
      if (!user) return done(null, false);
      return done(null, user);
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL:
        process.env.NODE_ENV === "development"
          ? "http://localhost:5000/auth/facebook/callback"
          : "https://fcloneodin.herokuapp.com/auth/facebook/callback",
      //passReqToCallback: true,
      profileFields: ["displayName", "photos", "email"],
    },
    (accessToken, refreshToken, profile, cb) => {
      User.findOne({ email: profile.emails[0].value })
        //.populate("friends")
        .exec((err, user) => {
          if (user) {
            return cb(err, user);
          } else {
            User.create(
              {
                email: profile.emails[0].value,
                profile_photo: profile.photos[0].value,
                facebookID: profile.id,
                display_name: profile.displayName,
              },
              (err, user) => {
                return cb(err, user);
              }
            );
          }
        });
    }
  )
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (email, password, done) => {
      User.findOne({ email: email })
        .populate("friends")
        .exec((err, user) => {
          if (err) return done(err);
          if (!user) return done({ message: "Email not found!" }, false);
          //check for password match
          bcrypt.compare(password, user.password, (err, match) => {
            if (err) return done(err, false);
            if (!match) return done({ message: "Password incorrect!" }, false);
            return done(null, user);
          });
        });
    }
  )
);

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  cb(null, user);
});

module.exports = passport;
