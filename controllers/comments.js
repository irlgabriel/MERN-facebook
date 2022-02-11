const { body, validationResult } = require("express-validator");
const multer = require("multer");
const AWS = require("aws-sdk");
const async = require("async");
const path = require("path");
const Comment = require("../models/comments");
const Notification = require("../models/notifications");
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

module.exports.get_comments = (req, res, next) => {
  Comment.find({ post: req.params.post_id })
    .populate("post")
    .populate("comment")
    .populate("user")
    .populate("likes")
    .sort("-createdAt")
    .exec((err, comments) => {
      if (err) return res.status(400).json(err);
      res.json(comments);
    });
};

// GET REPLIES
module.exports.get_replies = (req, res, next) => {
  Comment.find({ comment: req.params.comment_id })
    .populate("comment")
    .populate("user")
    .populate("user")
    .exec((err, replies) => {
      if (err) return res.status(400).json(err);
      res.json(replies);
    });
};

module.exports.create_comment = [
  //body('content').trim().isLength({min: 1}).escape(),
  upload,
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json(errors.array());

    const newComment = {
      content: req.body.content,
      comment: req.body.comment,
      user: req.user.user_id,
      post: req.params.post_id,
    };

    Comment.create(newComment, (err, comment) => {
      if (err) return res.status(400).json(err);
      if (req.file) {
        const originalName = req.file.originalname.split(".");
        const format = originalName[originalName.length - 1];

        const params = {
          Bucket: process.env.AWS_BUCKET,
          Key: `${comment._id}.${format}`,
          Body: req.file.buffer,
        };

        S3.upload(params, (err, data) => {
          if (err) {
            console.log(err);
          } else {
            Comment.findOneAndUpdate(
              { _id: comment._id },
              {
                image: {
                  url: data.Location,
                  id: comment._id.toString() + "." + format,
                },
              },
              { new: true },
              (err, comment) => {
                if (err) console.log(err);
                comment
                  .populate("user")
                  .populate("comment")
                  .populate("post")
                  .populate("likes")
                  .execPopulate()
                  .then((comment) => res.json(comment));
              }
            );
          }
        });
      } else {
        comment
          .populate("user")
          .populate("comment")
          .populate("post")
          .populate("likes")
          .execPopulate()
          .then((comment) => res.json(comment));
      }
    });
  },
];

module.exports.edit_comment = [
  upload,
  //body("content").trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json(errors.array());

    const { content } = req.body;

    Comment.findById(req.params.comment_id, (err, comment) => {
      // if a file is sent with the request then we update it as well and upload it to s3!
      if (err) return res.status(400).json(err);
      // Delete image from AWS if there's any
      /*
      if (comment.image) {
        const params = {
          Bucket: process.env.AWS_BUCKET,
          Key: comment.image.id,
        };
        S3.deleteObject(params, (err, data) => {
          if (err) next(err);
        });
      }
      */

      if (req.file) {
        const originalName = req.file.originalname.split(".");
        const format = originalName[originalName.length - 1];

        const params = {
          Bucket: process.env.AWS_BUCKET,
          Key: `${comment._id}.${format}`,
          Body: req.file.buffer,
        };

        S3.upload(params, (err, data) => {
          if (err) return res.status(400).json(err);
          Comment.findOneAndUpdate(
            { _id: comment._id },
            {
              image: {
                url: data.Location,
                id: comment._id.toString() + "." + format,
              },
              content,
            },
            { new: true },
            (err, comment) => {
              if (err) console.log(err);
              comment
                .populate("user")
                .populate("comment")
                .populate("post")
                .populate("likes")
                .execPopulate()
                .then((comment) => res.json(comment));
            }
          );
        });
      } else {
        Comment.findOneAndUpdate(
          { _id: req.params.comment_id },
          { content },
          { new: true },
          (err, comment) => {
            if (err) return res.status(400).json(err);
            comment
              .populate("user")
              .populate("comment")
              .populate("post")
              .populate("likes")
              .execPopulate()
              .then((comment) => res.json(comment));
          }
        );
      }
    });
  },
];

module.exports.like_comment = (req, res, next) => {
  const user_id = req.user.user_id;
  Comment.findOne({ _id: req.params.comment_id }, (err, comment) => {
    if (err) return res.status(400).json(err);
    if (comment.likes.includes(user_id)) {
      Comment.findOneAndUpdate(
        { _id: req.params.comment_id },
        { $pull: { likes: user_id } },
        { new: true },
        (err, updatedComment) => {
          if (err) return res.status(400).json(err);
          updatedComment
            .populate("user")
            .populate("comment")
            .populate("post")
            .populate("likes")
            .execPopulate()
            .then((populatedComment) => res.json(populatedComment));
        }
      );
    } else {
      Comment.findOneAndUpdate(
        { _id: req.params.comment_id },
        { $push: { likes: user_id } },
        { new: true },
        async (err, updatedComment) => {
          if (err) return res.status(400).json(err);
          // Send notification to the post's author;
          const from = await User.findById(user_id);
          const to = await User.findById(updatedComment.user._id);
          if (to._id !== from._id) {
            Notification.create(
              {
                from,
                to,
                type: "like_comment",
                url: `/posts/${req.params.post_id}`,
              },
              (err, notification) => {
                if (err) return res.status(400).json(err);
                updatedComment
                  .populate("user")
                  .populate("comment")
                  .populate("post")
                  .populate("likes")
                  .execPopulate()
                  .then((populatedComment) => res.json(populatedComment));
              }
            );
          } else {
            updatedComment
              .populate("user")
              .populate("comment")
              .populate("post")
              .populate("likes")
              .execPopulate()
              .then((populatedComment) => res.json(populatedComment));
          }
        }
      );
    }
  });
};

module.exports.delete_comment = (req, res, next) => {
  Comment.findOneAndRemove({ _id: req.params.comment_id }, (err, comment) => {
    if (err) return res.status(400).json(err);

    // Delete image from AWS if there's any
    if (comment.image) {
      const params = {
        Bucket: process.env.AWS_BUCKET,
        Key: comment.image.id,
      };
      S3.deleteObject(params, (err, data) => {
        if (err) next(err);
      });
    }

    Comment.deleteMany({ comment_id: comment._id }, (err, deletedComments) => {
      if (err) return res.status(400).json(err);
    });
    res.json(comment);
  });
};
