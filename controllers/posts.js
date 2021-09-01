const { body, validationResult } = require("express-validator");
const multer = require("multer");
const AWS = require("aws-sdk");
const path = require("path");

const Post = require("../models/posts");
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

exports.get_posts = (req, res, next) => {
  Post.find()
    .sort("-createdAt")
    .populate("likes")
    .exec((err, posts) => {
      if (err) return res.status(400).json(err);

      Post.populate(posts, { path: "user" }, (err, populatedPosts) => {
        if (err) return res.status(400).json(err);
        res.json(populatedPosts);
      });
    });
};

exports.get_post = (req, res, next) => {
  Post.findById(req.params.post_id)
    .populate("user")
    .populate("likes")
    .exec((err, post) => {
      if (err) next(err);
      res.json(post);
    });
};

exports.create_post = [
  body("content").trim().isLength({ min: 1 }).escape(),
  upload,
  (req, res, next) => {
    console.log("req.body", req.body);
    const { content } = req.body;

    const errors = validationResult(req);

    Post.create({ content, user: req.user.user_id }, (err, post) => {
      if (err) return res.status(400).json(err);

      if (req.file) {
        const originalName = req.file.originalname.split(".");
        const format = originalName[originalName.length - 1];

        const params = {
          Bucket: process.env.AWS_BUCKET,
          Key: `${post._id}.${format}`,
          Body: req.file.buffer,
        };
        S3.upload(params, (err, data) => {
          if (err) {
            console.log(err);
          } else {
            post.image = {
              url: data.Location,
              id: post._id.toString() + "." + format,
            };
            post.save((err, post) => {
              if (err) return res.status(400).json(err);
              post
                .populate("user")
                .execPopulate()
                .then((post) => res.json(post))
                .catch((err) => res.json(err));
            });
          }
        });
      } else {
        post
          .populate("user")
          .execPopulate()
          .then((post) => res.json(post))
          .catch((err) => res.json(err));
      }
    });

    /*
    S3.upload(params, (error, data) => {
      if(error) {
        console.log(error) 
      } else {
        Post.create({content, user: ._id, image: {url: data.Location, id: data.Key}}, (err, post) => {
          if(err) return res.status(400).json(err);
          post
          .populate('user')
          .execPopulate()
          .then(populatedPost => res.json(populatedPost))
          .catch(err => console.log(err))
        })
      }
    })
    */

    // Add document to mongodb
  },
];

exports.edit_post = [
  upload,
  //body("content").trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    const { content } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json(errors.array());

    Post.findById(req.params.post_id, (err, post) => {
      if (err) res.status(400).json(err);
      if (req.file) {
        //upload it to s3
        const originalName = req.file.originalname.split(".");
        const format = originalName[originalName.length - 1];

        const params = {
          Bucket: process.env.AWS_BUCKET,
          Key: `${post._id}.${format}`,
          Body: req.file.buffer,
        };
        S3.upload(params, (err, data) => {
          if (err) console.log(err);
          Post.findOneAndUpdate(
            { _id: req.params.post_id },
            {
              image: {
                url: data.Location,
                id: post._id.toString() + "." + format,
              },
              content,
            },
            { new: true }
          )
            .populate("user")
            .populate("likes")
            .exec((err, post) => {
              if (err) res.status(400).json(err);
              res.json(post);
            });
        });
      } else {
        Post.findOneAndUpdate(
          { _id: req.params.post_id },
          { content },
          { new: true }
        )
          .populate("user")
          .populate("likes")
          .exec((err, post) => {
            if (err) return res.status(400).json(err);
            res.json(post);
          });
      }
    });
  },
];

exports.like_post = (req, res, next) => {
  const user_id = req.user.user_id;
  Post.findOne({ _id: req.params.post_id }, (err, post) => {
    if (err) return res.status(400).json(err);
    if (post.likes.includes(user_id)) {
      Post.findOneAndUpdate(
        { _id: req.params.post_id },
        { $pull: { likes: user_id } },
        { new: true }
      )
        .populate("user")
        .populate("likes")
        .exec((err, updatedPost) => {
          if (err) return res.status(400).json(err);
          return res.json(updatedPost);
        });
    } else {
      Post.findOneAndUpdate(
        { _id: req.params.post_id },
        { $push: { likes: user_id } },
        { new: true }
      )
        .populate("user")
        .populate("likes")
        .exec(async (err, updatedPost) => {
          if (err) return res.status(400).json(err);

          // Send notification to the post's author;
          const from = await User.findOne({ _id: user_id });
          const to = await User.findOne({ _id: updatedPost.user._id });
          Notification.create(
            {
              from,
              to,
              type: "like_post",
              url: `/posts/${req.params.post_id}`,
            },
            (err, notification) => {
              if (err) return res.status(400).json(err);
              return res.json(updatedPost);
            }
          );
        });
    }
  });
};

exports.delete_post = (req, res, next) => {
  Post.findOneAndDelete({ _id: req.params.post_id }, (err, post) => {
    if (err) return res.status(400).json(err);

    // Delete image from AWS, if there's any
    if (post.image) {
      const params = {
        Bucket: process.env.AWS_BUCKET,
        Key: post.image.id,
      };
      S3.deleteObject(params, (err, data) => {
        if (err) {
          next(err);
        } else {
        }
      });
    }
    res.json(post);
  });
};
