import mongoose, { Schema, Document, InferSchemaType } from "mongoose";
import { Comment } from "./comments";

export type IPost = InferSchemaType<typeof postSchema>;

const postSchema = new Schema(
  {
    content: String,
    image: { type: Object },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    commentsCount: { type: Number, default: 0 },
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

export const Post = mongoose.model("Post", postSchema);
