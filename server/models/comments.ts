import mongoose, { Schema, InferSchemaType } from "mongoose";

const commentSchema = new Schema(
  {
    content: String,
    user: { type: Schema.Types.ObjectId, ref: "User" },
    image: Object,
    post: { type: Schema.Types.ObjectId, ref: "Post" },
    comment: { type: Schema.Types.ObjectId, ref: "Comment" },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export type IComment = InferSchemaType<typeof commentSchema>;

// todo
// TODO DELETE DEPENDENT COMMENTS ON POST DELETE

export const Comment = mongoose.model("Comment", commentSchema);
