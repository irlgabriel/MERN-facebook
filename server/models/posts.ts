import mongoose, { Schema, Document, InferSchemaType } from "mongoose";
import { Comment } from "./comments";

export type IPost = InferSchemaType<typeof postSchema>;

const postSchema = new Schema(
  {
    content: String,
    image: { type: Object },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number },
  },
  { timestamps: true }
);

postSchema.post(
  "findOneAndDelete",
  async function (doc: Document<IPost>, next) {
    try {
      await Comment.deleteMany({ post: { $eq: doc.id } });
    } catch (e: any) {
      next(e);
    }
  }
);

postSchema.pre("save", async function (next) {
  this.likesCount = this.likes.length;
  const commentsCount = await Comment.countDocuments({ comment: this.id });

  this.commentsCount = commentsCount;
  next();
});

export const Post = mongoose.model("Post", postSchema);
