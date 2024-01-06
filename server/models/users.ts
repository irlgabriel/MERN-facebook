import mongoose, { InferSchemaType, Schema } from "mongoose";
import { Post } from "./posts";
import Comment from "./comments";

export type IUser = InferSchemaType<typeof UserSchema> & { _id: string };

const UserSchema = new Schema(
  {
    email: String,
    profile_photo: {
      type: String,
      default: "http://54.93.240.69/images/no_pic.jpg",
    },
    cover_photo: { type: String },
    description: { type: String, default: "" },
    password: String,
    facebookID: String,
    display_name: String,
    first_name: String,
    last_name: String,
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    photos: [{ type: Object }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

UserSchema.virtual("full_name").get(function (this: IUser) {
  return this.first_name + " " + this.last_name;
});

UserSchema.pre(
  "deleteOne",
  { query: true, document: false },
  async function (next) {
    const userId = this.getFilter()["_id"];

    // delete all posts
    try {
      await Post.deleteMany({ user: userId });
    } catch (e: any) {
      next(e);
    }
    // delete all comments
    try {
      await Comment.deleteMany({ user: userId });
    } catch (e: any) {
      next(e);
    }
    // delete this user from all their friends' list
    try {
      await User.updateMany(
        { friends: { $includes: userId } },
        { $pull: { friends: userId } }
      );
    } catch (e: any) {
      next(e);
    }
  }
);

export { User };
