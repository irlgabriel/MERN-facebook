import { body, validationResult } from "express-validator";
import multer, { Options } from "multer";
import AWS from "aws-sdk";
import path from "path";

import { Post } from "../../models/posts";
import { Notification } from "../../models/notifications";
import { User } from "../../models/users";
import { RequestHandler } from "express";
import { DeleteObjectOutput, ManagedUpload } from "aws-sdk/clients/s3";
import { GetPostsRequestInput } from "./types";

// AWS
const S3 = new AWS.S3();

const storage = multer.memoryStorage();

const fileFilter: Options["fileFilter"] = (req, file, callback) => {
  var ext = path.extname(file.originalname);
  if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
    return callback(new Error("Only images are allowed"));
  }
  callback(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("image");

export const get_posts: RequestHandler<
  any,
  any,
  any,
  GetPostsRequestInput
> = async (req, res, next) => {
  console.log(req.query);
  const { offset, pageSize } = req.query;

  try {
    const posts = await Post.find()
      .limit(pageSize)
      .skip(offset)
      .sort("-createdAt")
      .populate(["likes", "user"]);
    res.json(posts);
  } catch (e) {
    next(e);
  }
};

export const get_post: RequestHandler = async (req, res, next) => {
  console.log(req, req.params);
  try {
    if (req.params.post_id) res.send(req.params.post_id);
    const post = await Post.findById(req.params.post_id).populate([
      "user",
      "likes",
    ]);

    if (!post) throw new Error("Could not find post!");
    res.json(post);
  } catch (e) {
    next(e);
  }
};

export const create_post: RequestHandler[] = [
  body("content").trim().isLength({ min: 0 }).escape(),
  upload,
  async (req, res, next) => {
    const { content } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json(errors.array());

    try {
      const post = await Post.create({
        content: content || "",
        user: req.user.user_id,
      });

      if (req.file) {
        const originalName = req.file.originalname.split(".");
        const format = originalName[originalName.length - 1];

        const params = {
          Bucket: process.env.AWS_BUCKET,
          Key: `${post._id}.${format}`,
          Body: req.file.buffer,
        };
        S3.upload(params, async (err: Error, data: ManagedUpload.SendData) => {
          if (err) {
            console.log(err);
          } else {
            post.image = {
              url: data.Location,
              id: post._id.toString() + "." + format,
            };
            await post.save();
          }
        });
      }
      const newPost = await post.populate("user");
      res.json(newPost);
    } catch (e) {
      next(e);
    }
  },
];

export const edit_post: RequestHandler[] = [
  upload,
  //body("content").trim().isLength({ min: 1 }).escape(),
  async (req, res, next) => {
    const { content } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json(errors.array());

    try {
      const post = await Post.findById(req.params.post_id);
      if (!post) throw new Error("Could not find post!");

      if (req.file) {
        //upload it to s3
        const originalName = req.file.originalname.split(".");
        const format = originalName[originalName.length - 1];

        const params = {
          Bucket: process.env.AWS_BUCKET,
          Key: `${post._id}.${format}`,
          Body: req.file.buffer,
        };
        S3.upload(params, async (err: Error, data: ManagedUpload.SendData) => {
          if (err) console.log(err);
          const newPost = await Post.findOneAndUpdate(
            { _id: req.params.post_id },
            {
              image: {
                url: data.Location,
                id: post._id.toString() + "." + format,
              },
              content,
            },
            { new: true }
          ).populate("user", "likes");

          res.json(newPost);
        });
      } else {
        const newPost = await Post.findOneAndUpdate(
          { _id: req.params.post_id },
          { content },
          { new: true }
        ).populate("user", "likes");

        res.json(newPost);
      }
    } catch (e) {
      next(e);
    }
  },
];

export const like_post: RequestHandler = async (req, res, next) => {
  const user_id = req.user.user_id;
  try {
    const post = await Post.findOne({ _id: req.params.post_id });

    if (!post) throw new Error("Could not find post!");

    if (post.likes.find((like) => like?.toString() === user_id)) {
      const updatedPost = await Post.findOneAndUpdate(
        { _id: req.params.post_id },
        { $pull: { likes: user_id } },
        { new: true }
      ).populate("user", "likes");
      res.json(updatedPost);
    } else {
      const updatedPost = await Post.findOneAndUpdate(
        { _id: req.params.post_id },
        { $push: { likes: user_id } },
        { new: true }
      )
        .populate("user")
        .populate("likes");

      if (!updatedPost) throw new Error("Could not find post!");

      // Send notification to the post's author;
      const from = await User.findOne({ _id: user_id });
      const to = await User.findOne({ _id: updatedPost.user?._id });
      await Notification.create({
        from,
        to,
        type: "like_post",
        url: `/posts/${req.params.post_id}`,
      });
      res.json(updatedPost);
    }
  } catch (e) {
    next(e);
  }
};

export const delete_post: RequestHandler = async (req, res, next) => {
  try {
    const post = await Post.findOneAndDelete({ _id: req.params.post_id });

    // Delete image from AWS, if there's any
    //@ts-ignore
    if (post.image) {
      const params = {
        Bucket: process.env.AWS_BUCKET,
        //@ts-ignore
        Key: post.image.id,
      };
      S3.deleteObject(params, (err: Error, data: DeleteObjectOutput) => {
        if (err) {
          next(err);
        }
      });
    }
    res.json(post);
  } catch (e) {
    next(e);
  }
};
