import mongoose, { Schema, InferSchemaType, ObjectId } from "mongoose";

const commentSchema = new Schema(
  {
    content: String,
    user: { type: Schema.types.ObjectId, ref: "User" },
    image: Object,
    post: { type: Schema.types.ObjectId, ref: "Post" },
    comment: { type: Schema.types.ObjectId, ref: "Comment" },
    commentsCount: { type: Schema.types.Number, default: 0 },
    likes: [{ type: Schema.types.ObjectId, ref: "User" }],
    likesCount: { type: Schema.types.Number, default: 0 },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

commentSchema.pre("save", async function (next) {
  const commentId = this._id;

  const commentsCount = await mongoose
    .model("Comment", commentSchema)
    .countDocuments({ comment: commentId });

  this.commentsCount = commentsCount;
  this.likesCount = this.likes.length;
  next();
});

commentSchema.pre(
  "deleteOne",
  { document: false, query: true },
  async function (next) {
    // https://stackoverflow.com/questions/59147493/mongoose-deleteone-middleware-for-cascading-delete-not-working
    const parentCommentId = this.getFilter()["_id"];

    // no dependant comments (replies)
    if (!parentCommentId) {
      next();
    }

    await Comment.deleteMany({ comment: parentCommentId });
    next();
  }
);

// TODO DELETE DEPENDENT COMMENTS ON POST DELETE

export type IComment = InferSchemaType<typeof commentSchema> & {
  _id: string;
};

export default Comment;
