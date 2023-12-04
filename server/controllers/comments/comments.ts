import { body, validationResult } from "express-validator";
import multer, { Options } from "multer";
import AWS from "aws-sdk";
import async from "async";
import path from "path";
import { Comment, IComment } from "../../models/comments";
import { Notification } from "../../models/notifications";
import { User } from "../../models/users";
import { Request, RequestHandler } from "express";
import { CallbackError, Document } from "mongoose";
import { ManagedUpload } from "aws-sdk/clients/s3";
import {
  CreateCommentInput,
  CreateCommentParams,
  DeleteCommmentParams,
  EditCommentInput,
  LikeCommentInput,
} from "../auth/types";

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

export const get_comments: RequestHandler<{ post_id: string }> = async (
  req,
  res,
  next
) => {
  const post_id = req.params.post_id;
  try {
    const comments = await Comment.find({ post: post_id })
      .populate(["post", "comment", "user", "likes"])
      .sort("-createdAt");
    res.json(comments);
  } catch (e) {
    next(e);
  }
};

// GET REPLIES
export const get_replies: RequestHandler<{ comment_id: string }> = async (
  req,
  res,
  next
) => {
  try {
    const replies = await Comment.find({ $comment: req.params.comment_id })
      .populate("comment")
      .populate("user")
      .populate("user")
      .exec();
    res.json(replies);
  } catch (e) {
    if (e) return res.status(400).json(e);
  }
};

export const create_comment: RequestHandler<
  CreateCommentParams,
  any,
  CreateCommentInput
>[] = [
  //body('content').trim().isLength({min: 1}).escape(),
  upload,
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json(errors.array());

    const newComment = {
      content: req.body.content,
      comment: req.body.comment,
      user: req.user?.user_id,
      post: req.params.post_id,
    };

    try {
      const comment = await Comment.create(newComment);

      // WITH FILE!
      if (req.file) {
        const originalName = req.file.originalname.split(".");
        const format = originalName[originalName.length - 1];

        const params = {
          Bucket: process.env.AWS_BUCKET,
          Key: `${comment._id}.${format}`,
          Body: req.file.buffer,
        };

        S3.upload(params, async (err: Error, data: ManagedUpload.SendData) => {
          if (err) {
            console.log("Error uploading:", err);
            next(err);
          } else {
            try {
              const newComment = await Comment.findOneAndUpdate(
                { _id: comment._id },
                {
                  image: {
                    url: data.Location,
                    id: comment._id.toString() + "." + format,
                  },
                },
                { new: true, populate: ["user", "comment", "post", "likes"] }
              );

              res.json(newComment);
            } catch (e) {
              res.status(400).json(e);
            }
          }
        });
      }
    } catch (e) {
      if (e) return res.status(400).json(e);
    }
  },
];

export const edit_comment: RequestHandler<any, any, any>[] = [
  upload,
  async (req: Request<any, any, EditCommentInput>, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json(errors.array());

    const { content } = req.body;

    try {
      const comment = await Comment.findById(req.params.comment_id);
      if (!comment) return next(new Error("Could not find post!"));

      if (req.file) {
        const originalName = req.file.originalname.split(".");
        const format = originalName[originalName.length - 1];

        const params = {
          Bucket: process.env.AWS_BUCKET,
          Key: `${comment._id}.${format}`,
          Body: req.file.buffer,
        };

        S3.upload(params, async (err: Error, data: ManagedUpload.SendData) => {
          if (err) return res.status(400).json(err);
          try {
            const newComment = await Comment.findOneAndUpdate(
              { _id: comment._id },
              {
                image: {
                  url: data.Location,
                  id: comment._id.toString() + "." + format,
                },
                content,
              },
              { new: true }
            );

            if (!newComment) throw new Error("Could not find comment!");

            try {
              const comment = await newComment.populate([
                "user",
                "comment",
                "post",
                "likes",
              ]);
              res.json(comment);
            } catch (e) {
              next(e);
            }
          } catch (e) {
            next(e);
          }
        });
      } else {
        try {
          const comment = await Comment.findOneAndUpdate(
            { _id: req.params.comment_id },
            { content },
            { new: true }
          );
          if (!comment) throw new Error("Could not find comment!");
          try {
            const newComment = await comment.populate([
              "user",
              "comment",
              "post",
              "likes",
            ]);
            res.json(newComment);
          } catch (e) {
            next(e);
          }
        } catch (e) {
          next(e);
        }
      }
    } catch (e) {
      return res.status(400).json(e);
    }
  },
];

export const like_comment: RequestHandler<LikeCommentInput> = async (
  req,
  res,
  next
) => {
  const user_id = req.user?.user_id;
  try {
    const comment = await Comment.findOne(
      { _id: req.params.comment_id },
      {},
      {}
    );
    if (!comment) throw new Error("Could not find Comment!");

    // UNLIKE
    if (comment.likes.find((d) => d.equals(user_id))) {
      try {
        const newComment = await Comment.findOneAndUpdate(
          { _id: req.params.comment_id },
          { $pull: { likes: user_id } },
          { new: true }
        );
        if (!newComment) throw new Error("Could not find Comment!");

        try {
          const comment = newComment.populate([
            "user",
            "comment",
            "post",
            "likes",
          ]);

          return res.json(comment);
        } catch (e) {
          next(e);
        }
      } catch (e) {
        next(e);
      }
      // LIKE
    } else {
      try {
        const newComment = await Comment.findOneAndUpdate(
          { _id: req.params.comment_id },
          { $push: { likes: user_id } },
          { new: true }
        );
        if (!newComment) throw new Error("Could not find Comment!");

        const from = await User.findById(user_id);
        const to = await User.findById(newComment.user?._id);
        if (!from || !to) throw new Error("Could not find user!");
        try {
          await Notification.create({
            from,
            to,
            type: "like_comment",
            url: `/posts/${req.params.post_id}`,
          });
          const comment = await newComment.populate([
            "user",
            "comment",
            "post",
            "likes",
          ]);
          res.json(comment);
        } catch (e) {
          next(e);
        }
      } catch (e) {
        next(e);
      }
    }
  } catch (e) {
    next(e);
  }
};

export const delete_comment: RequestHandler<DeleteCommmentParams> = async (
  req,
  res,
  next
) => {
  try {
    const comment = await Comment.findOneAndDelete(
      { _id: req.params.comment_id },
      {}
    );
    if (!comment) throw new Error("Could not find comment");

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

    // DELETE REPLIES
    try {
      await Comment.deleteMany();
      res.json(comment);
    } catch (e) {
      next(e);
    }
  } catch (e) {
    next(e);
  }
};
