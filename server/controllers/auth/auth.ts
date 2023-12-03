import passport from "passport";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import { IUser, User } from "../../models/users";
import { RequestHandler } from "express";
import { Document } from "mongoose";

export const login: RequestHandler[] = [
  (req, res, next) => {
    passport.authenticate(
      "local",
      { session: false },
      (
        err: any,
        user: Document<IUser>,
        info: object | string | Array<string | undefined>
      ) => {
        if (err) return res.status(400).json(err);
        if (!user) res.redirect(process.env.FRONTEND_URL as string);
        jwt.sign(
          { user_id: user._id },
          process.env.JWT_SECRET as string,
          (err: any, token?: string) => {
            res.cookie("token", token);
            res.json({ user, token });
          }
        );
      }
    )(req, res, next);
  },
];

export const isLoggedIn: RequestHandler = (req, res, next) => {
  if (req.user) {
    res.json({ user_id: req.user?.user_id! });
  } else {
    res.sendStatus(401);
  }
};

export const getUserToken: RequestHandler[] = [
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    if (req.user) res.json(req.user);
    else res.redirect(process.env.FRONTEND_URL as string);
  },
];

export const logout: RequestHandler = (req, res) => {
  // todo
  //@ts-ignore
  console.log({ reqSession: req.session });
  //@ts-ignore
  req.session.destroy(function () {
    res.sendStatus(200);
  });
};

export const facebook_callback: RequestHandler = (req, res, next) => {
  passport.authenticate(
    "facebook",
    { session: false },
    (
      err: any,
      user: Document<IUser>,
      info: object | string | Array<string | undefined>
    ) => {
      if (err) return next(err);
      if (!user) return res.redirect(process.env.FRONTEND_URL);
      jwt.sign(
        { user_id: user._id },
        process.env.JWT_SECRET,
        (err: any, token?: string) => {
          res.setHeader(
            `Set-Cookie`,
            `token=${token}; Path=/; SameSite=None; Secure;`
          );
          return res.redirect(process.env.FRONTEND_URL);
        }
      );
    }
  )(req, res, next);
};

export const register: RequestHandler[] = [
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
      .exec()
      .then(async (err: any, user?: IUser) => {
        if (err) return res.status(400).json(err);
        if (user)
          return res.status(400).json({ message: "Email already in use" });

        try {
          const hash = await bcrypt.hash(password, 10);
          const registeredUser = await User.create({
            email,
            first_name,
            last_name,
            password: hash,
            friends: ["5fcf4352afe8250880b947dd"],
          });

          await User.findOneAndUpdate(
            { _id: "5fcf4352afe8250880b947dd" },
            { $push: { friends: registeredUser._id } }
          );

          jwt.sign(
            { user_id: registeredUser._id },
            process.env.JWT_SECRET,
            (err: any, token?: string) => {
              if (err) return res.status(400).json(err);
              res.json(token);
            }
          );
        } catch (e) {
          return res.status(400).json(err);
        }
      });
  },
];
