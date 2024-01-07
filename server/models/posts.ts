import mongoose, { Schema, Document, InferSchemaType } from "mongoose";
import Comment from "./comments";

export type IPost = InferSchemaType<typeof postSchema> & { _id: string };

const postSchema = new Schema(
  {
    content: String,
    image: { type: Object },
    user: { type: Schema.types.ObjectId, ref: "User" },
    likes: [{ type: Schema.types.ObjectId, ref: "User" }],
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number },
  },
  { timestamps: true }
);

postSchema.pre("save", async function (next) {
  this.likesCount = this.likes.length;
  const commentsCount = await Comment.countDocuments({ comment: this.id });

  this.commentsCount = commentsCount;
  next();
});

postSchema.pre(
  "deleteOne",
  { query: true, document: false },
  async function (next) {
    const parentPostId = this.getFilter()["_id"];

    try {
      await Comment.deleteMany({ post: parentPostId });
    } catch (e: any) {
      next(e);
    }
  }
);

export const Post = mongoose.model("Post", postSchema);
