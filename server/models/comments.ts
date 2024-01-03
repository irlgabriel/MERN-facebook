import mongoose, { Schema, InferSchemaType } from "mongoose";

const commentSchema = new Schema(
  {
    content: String,
    user: { type: Schema.Types.ObjectId, ref: "User" },
    image: Object,
    post: { type: Schema.Types.ObjectId, ref: "Post" },
    comment: { type: Schema.Types.ObjectId, ref: "Comment" },
    commentsCount: { type: Schema.Types.Number, default: 0 },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    likesCount: { type: Schema.Types.Number, default: 0 },
  },
  { timestamps: true }
);

commentSchema.pre("save", async function (next) {
  const commentId = this._id;

  const commentsCount = await mongoose
    .model("Comment", commentSchema)
    .countDocuments({ comment: commentId });

  this.commentsCount = commentsCount;
  this.likesCount = this.likes.length;
  next();
});

export type IComment = InferSchemaType<typeof commentSchema>;

// todo
// TODO DELETE DEPENDENT COMMENTS ON POST DELETE

export const Comment = mongoose.model("Comment", commentSchema);
