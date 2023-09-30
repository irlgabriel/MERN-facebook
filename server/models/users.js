const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Post = require('./posts');
const Comment = require('./comments');

const UserSchema = new Schema(
  {
    email: String,
    profile_photo: {
      type: String,
      default: "https://fcloneodin.herokuapp.com/images/no_pic.jpg",
    },
    cover_photo: { type: String },
    description: {type: String, default: ''},
    password: String,
    facebookID: String,
    display_name: String,
    first_name: String,
    last_name: String,
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    photos: [{ type: Object }]
  },
  { timestamps: true }
);

UserSchema.virtual("full_name").get(function () {
  return this.first_name + " " + this.last_name;
});

UserSchema.pre('remove', function(){
  
  // delete all posts of this user
  Post.deleteMany({user: this._id}, (err, docs) => {
    if(err) return next(err);
  })
  // delete all comments of this user
  Comment.deleteMany({user: this._id}, (err, docs) => {
    if(err) return next(err);
  })
  // delete this user form all their friends' list
  this.friends.forEach(friend => {
    friend.update({$pull: {friends: this._id}}).exec();
  })
  return next();
})

module.exports = mongoose.model("User", UserSchema);
