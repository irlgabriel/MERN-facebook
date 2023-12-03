import mongoose, { InferSchemaType, Schema } from "mongoose";
import { Post } from "./posts";
import { Comment } from "./comments";

export type IUser = InferSchemaType<typeof UserSchema>;

const UserSchema = new Schema(
  {
    email: String,
    profile_photo: {
      type: String,
      default: "https://fcloneodin.herokuapp.com/images/no_pic.jpg",
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

// UserSchema.pre("remove", async function (next) {
//   // delete all posts of this user
//   try {
//     await Post.deleteMany({ user: this._id });
//   } catch (e: any) {
//     next(e);
//   }
//   // delete all comments of this user
//   try {
//     await Comment.deleteMany({ user: this._id });
//   } catch (e: any) {
//     next(e);
//   }
//   // delete this user form all their friends' list
//   this.friends.forEach((friend) => {
//     (friend as any as typeof User)
//       .updateOne({ $pull: { friends: this._id } })
//       .exec();
//   });
//   return next();
// });

export { User };
