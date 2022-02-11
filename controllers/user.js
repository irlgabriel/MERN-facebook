const { body, validationResult } = require("express-validator");
const multer = require("multer");
const AWS = require("aws-sdk");
const path = require("path");

const User = require("../models/users");

// AWS
const S3 = new AWS.S3();

const storage = multer.memoryStorage({
  destination: (req, file, callback) => {
    callback(null, "");
  },
});

const fileFilter = (req, file, callback) => {
  var ext = path.extname(file.originalname);
  if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
    return callback(new Error("Only images are allowed"));
  }
  callback(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: 5 * 1024 * 1024,
}).single("image");
exports.update_profile_photo = [
  upload,
  (req, res, next) => {
    const original_file = req.file.originalname.split(".");
    const format = original_file[original_file.length - 1];

    User.findById(req.params.user_id, (err, user) => {
      if (err) return res.status(400).json(err);

      const params = {
        Bucket: process.env.AWS_BUCKET,
        Key: `${user._id}_profile.${format}`,
        Body: req.file.buffer,
      };

      //Delete previous instance from s3
      S3.deleteObject(
        { Bucket: params.Bucket, Key: params.Key },
        (err, data) => {
          if (err) return res.status(500).json(err);
        }
      );

      S3.upload(params, (err, data) => {
        if (err) return res.status(500).json(err);
        User.findOneAndUpdate(
          { _id: req.params.user_id },
          { profile_photo: data.Location },
          { new: true },
          (err, updatedUser) => {
            if (err) return res.status(400).json(err);
            return res.json(updatedUser);
          }
        );
      });
    });
  },
];

exports.update_cover_photo = [
  upload,
  (req, res, next) => {
    const original_file = req.file.originalname.split(".");
    const format = original_file[original_file.length - 1];

    User.findById(req.params.user_id, (err, user) => {
      if (err) return res.status(400).json(err);

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

      S3.upload(params, (err, data) => {
        if (err) return res.status(500).json(err);
        User.findOneAndUpdate(
          { _id: req.params.user_id },
          { cover_photo: data.Location },
          { new: true },
          (err, updatedUser) => {
            if (err) return res.status(400).json(err);
            return res.json(updatedUser);
          }
        );
      });
    });
  },
];

exports.delete_user = (req, res, next) => {
  User.findById(req.user.user_id, (err, user) => {
    // delete user from all friends' lists
    if (err) return next(err);
    user.remove((err, doc) => {
      if (err) return next(err);
      res.json(doc);
    });
  });
};

exports.get_users = (req, res, next) => {
  User.find((err, users) => {
    if (err) return res.status(400).json(err);
    res.json(users);
  });
};

exports.get_user = (req, res, next) => {
  User.findById(req.params.user_id)
    .populate("friends")
    .exec((err, user) => {
      if (err) return res.status(400).json(err);
      return res.json(user);
    });
};

// updates user's description field
exports.update_desc = [
  body("description").trim().isLength({ min: 1, max: 150 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json(errors.array());

    User.findOneAndUpdate(
      { _id: req.params.user_id },
      { description: req.body.description },
      { new: true },
      (err, user) => {
        if (err) return res.status(400).json(err);
        res.json(user);
      }
    );
  },
];
