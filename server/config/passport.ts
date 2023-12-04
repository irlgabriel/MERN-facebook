import passport from "passport";
import bcrypt from "bcrypt";
import { Strategy as JWTStrategy } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as FacebookStrategy } from "passport-facebook";

import { ExtractJwt } from "passport-jwt";

import { IUser, User } from "../models/users";

passport.use(
  new JWTStrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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
      clientID: process.env.FACEBOOK_APP_ID as string,
      clientSecret: process.env.FACEBOOK_APP_SECRET as string,
      callbackURL:
        process.env.NODE_ENV === "development"
          ? "http://localhost:5000/auth/facebook/callback"
          : "https://fcloneodin.herokuapp.com/auth/facebook/callback",
      //passReqToCallback: true,
      profileFields: ["displayName", "photos", "email"],
    },
    async (_, __, profile, cb) => {
      try {
        const user = await User.findOne({ email: profile?.emails?.[0].value });

        if (user) {
          return cb(null, user);
        } else {
          const user = await User.create({
            email: profile.emails?.[0].value,
            profile_photo: profile.photos?.[0].value,
            facebookID: profile.id,
            display_name: profile.displayName,
          });
          return cb(null, user);
        }
      } catch (e) {
        cb(e);
      }
    }
  )
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email }).populate("friends");
        if (!user) return done({ message: "Email not found!" }, false);
        if (!user.password) done({ message: "Password cannot be empty!" });
        //check for password match
        bcrypt.compare(password, user.password as string, (err, match) => {
          if (err) return done(err, false);
          if (!match) return done({ message: "Password incorrect!" }, false);
          return done(null, user);
        });
      } catch (e) {
        done(e);
      }
    }
  )
);

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user: IUser, cb) {
  cb(null, user);
});

module.exports = passport;
