const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    to: { type: Schema.Types.ObjectId, ref: "User" },
    from: { type: Schema.Types.ObjectId, ref: "User" },
    clicked: { type: Boolean, default: false },
    url: String,
    type: String,
    message: String,
  },
  { timestamps: true }
);

notificationSchema.pre("save", function () {
  if (this.isNew) {
    from_name = this.from.display_name || this.from.full_name;
    //to_name = this.to.display_name || this.to.full_name;
    // create message based on type
    switch (this.type) {
      case "like_post":
        this.message = `${from_name} liked your post`;
        break;
      case "like_comment":
        this.message = `${from_name} liked your comment`;
        break;
      case "friend_request":
        this.message = `${from_name} sent you a friend request`;
        break;
    }
  }
});

module.exports = mongoose.model("Notification", notificationSchema);
