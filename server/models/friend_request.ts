import mongoose, { InferSchemaType, ObjectId, Schema } from "mongoose";

export type IFriendRequest = InferSchemaType<typeof schema>;

const schema = new Schema(
  {
    from: { type: Schema.Types.ObjectId, ref: "User" },
    to: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const FriendRequest = mongoose.model("FriendRequest", schema);
