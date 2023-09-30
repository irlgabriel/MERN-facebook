const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const frSchema = new Schema(
  {
    from: { type: Schema.Types.ObjectId, ref: "User" },
    to: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FriendRequest", frSchema);
