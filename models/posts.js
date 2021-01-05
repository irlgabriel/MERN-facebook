const mongoose = require("mongoose");
const router = require("../routes/comment");
const Schema = mongoose.Schema;

const Comment = require("./comments");

const postSchema = new Schema(
  {
    content: String,
    image: { type: Object },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

postSchema.pre("findOneAndDelete", function () {
  console.log("running post delete middleware");
  this.find((err, doc) => {
    if (err) return res.status(400).json(err);
    console.log(doc);
    Comment.deleteMany({ post: doc._id }, (err, deletedComments) => {
      if (err) return res.status(400).json(err);
      //console.log(deletedComments);
    });
  });
});

module.exports = mongoose.model("Post", postSchema);
