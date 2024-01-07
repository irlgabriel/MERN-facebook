import mongoose, { InferSchemaType, Schema } from "mongoose";
import { SchemaTimestampsConfig } from "mongoose";
import { IUser } from "./users";

export type INotification = InferSchemaType<typeof notificationSchema>;

const notificationSchema = new Schema(
  {
    to: { type: Schema.types.ObjectId, ref: "User" },
    from: { type: Schema.types.ObjectId, ref: "User" },
    clicked: { type: Boolean, default: false },
    url: String,
    type: String,
    message: String,
  },
  { timestamps: true }
);

// notificationSchema.pre("save", function (this: INotification) {
//   if (this.clicked) {
//     const from_name =
//       this.from?.display_name ||
//       `${this.from?.first_name} ${this.from?.last_name}`;
//     //to_name = this.to.display_name || this.to.full_name;
//     // create message based on type
//     switch (this.type) {
//       case "like_post":
//         this.message = `${from_name} liked your post`;
//         break;
//       case "like_comment":
//         this.message = `${from_name} liked your comment`;
//         break;
//       case "friend_request":
//         this.message = `${from_name} sent you a friend request`;
//         break;
//     }
//   }
// });

const Notification = mongoose.model("Notification", notificationSchema);

export { Notification };
