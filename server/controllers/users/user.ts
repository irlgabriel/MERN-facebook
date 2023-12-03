import { body, validationResult } from "express-validator";
import multer, { Options } from "multer";
import AWS from "aws-sdk";
import path from "path";

import { User } from "../../models/users";
import { RequestHandler } from "express";
import { ManagedUpload } from "aws-sdk/clients/s3";

// AWS
const S3 = new AWS.S3();

const storage = multer.memoryStorage();

const fileFilter: Options["fileFilter"] = async (req, file, callback) => {
  var ext = path.extname(file.originalname);
  if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
    return callback(new Error("Only images are allowed"));
  }
  callback(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fieldSize: 5 * 1024 * 1024 },
}).single("image");

export const update_profile_photo: RequestHandler[] = [
  upload,
  async (req, res, next) => {
    try {
      if (!req.file) throw new Error("Could not find file!");
      const originalFile = req.file?.originalname.split(".");

      const format = originalFile[originalFile.length - 1];

      const user = await User.findById(req.params.user_id);
      if (!user) throw new Error("Could not find User!");

      const params = {
        Bucket: process.env.AWS_BUCKET,
        Key: `${user._id}_profile.${format}`,
        Body: req.file.buffer,
      };

      // Delete previous instance from s3
      S3.deleteObject({ Bucket: params.Bucket, Key: params.Key }, (err) => {
        if (err) return res.status(500).json(err);
      });

      S3.upload(params, async (err: Error, data: ManagedUpload.SendData) => {
        if (err) return res.status(500).json(err);
        const updatedUser = await User.findOneAndUpdate(
          { _id: req.params.user_id },
          { profile_photo: data.Location },
          { new: true }
        );
        res.json(updatedUser);
      });
    } catch (e) {
      next(e);
    }
  },
];

export const update_cover_photo: RequestHandler[] = [
  upload,
  async (req, res, next) => {
    try {
      if (!req.file) throw new Error("Could not find file!");
      const originalFile = req.file.originalname.split(".");
      const format = originalFile[originalFile.length - 1];

      const user = await User.findById(req.params.user_id);
      if (!user) throw new Error("Could not find User!");

      const params = {
        Bucket: process.env.AWS_BUCKET,
        Key: `${user._id}_cover.${format}`,
        Body: req.file.buffer,
      };

      //Delete previous instance from s3
      S3.deleteObject(
        { Bucket: params.Bucket, Key: params.Key },
        (err, data) => {
          if (err) return res.status(500).json(err);
        }
      );

      S3.upload(params, async (err: Error, data: ManagedUpload.SendData) => {
        if (err) throw err;
        const newUser = await User.findOneAndUpdate(
          { _id: req.params.user_id },
          { cover_photo: data.Location },
          { new: true }
        );
      });
    } catch (e) {
      next(e);
    }
  },
];

export const delete_user: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.user.user_id);
    res.json(user);
  } catch (e) {
    next(e);
  }
};

// todo
// paginate
export const get_users: RequestHandler = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (e) {
    next(e);
  }
};

export const get_user: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.user_id).populate("friends");
    res.json(user);
  } catch (e) {
    next(e);
  }
};

// updates user's description field
export const update_desc: RequestHandler[] = [
  body("description").trim().isLength({ min: 1, max: 150 }).escape(),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json(errors.array());

    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.user_id },
        { description: req.body.description },
        { new: true }
      );
      res.json(user);
    } catch (e) {
      next(e);
    }
  },
];
