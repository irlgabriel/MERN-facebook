const User = require("../models/users");
const FriendRequest = require("../models/friend_request");
const Notification = require("../models/notifications");

exports.get_friends_recommendations = (req, res, next) => {
  // Need to further filter recommendations to hide those users toward whom the logged in
  // user has already sent friend requests.

  // Find requests that this user sent.
  FriendRequest.find({ from: req.user.user_id }, (err, pendingSent) => {
    if (err) return console.log(err); //res.status(400).json(err);
    // filtering array
    let pending = [];
    // create an array of ids of users who received requests from the user.
    pending.push(...pendingSent.map((p) => p.to));

    // Find requests that this user received.
    FriendRequest.find({ to: req.user.user_id }, (err, pendingReceived) => {
      if (err) return res.status(400).json(err);
      // create an array of ids of users who sent request to the user
      pending.push(...pendingReceived.map((p) => p.from));
      User.find(
        {
          friends: { $ne: req.user.user_id },
          _id: { $ne: req.user.user_id, $nin: pending },
        },
        (err, reqs) => {
          if (err) return res.status(400).json(err);
          res.json(reqs);
        }
      );
    });
  });
};

exports.get_friends_requests = (req, res, next) => {
  FriendRequest.find({
    $or: [{ to: req.user.user_id }, { from: req.user.user_id }],
  })
    .populate("to")
    .populate("from")
    .exec((err, requests) => {
      if (err) return res.status(400).json(err);
      res.json(requests);
    });
};

exports.send_friend_request = (req, res, next) => {
  FriendRequest.create(
    { from: req.user.user_id, to: req.params.user_id },
    async (err, request) => {
      if (err) return res.status(400).json(err);

      const from = await User.findById(req.user.user_id);
      const to = await User.findById(req.params.user_id);

      Notification.create(
        {
          from,
          to,
          type: "friend_request",
          url: `/users/${from._id}`,
        },
        (err, notif) => {
          request
            .populate("from")
            .populate("to")
            .execPopulate()
            .then((req) => res.json(req));
        }
      );
    }
  );
};

exports.accept_friend_request = (req, res, next) => {
  FriendRequest.findOne({ _id: req.params.request_id }, (err, request) => {
    if (err) return res.status(400).json(err);

    // add this friend to each of the requests' users
    User.findOneAndUpdate(
      { _id: request.from },
      { $push: { friends: request.to } },
      (err) => {
        if (err) return res.status(400).json(err);
        User.findOneAndUpdate(
          { _id: request.to },
          { $push: { friends: request.from } },
          (err) => {
            if (err) return res.status(400).json(err);
            request.remove((err, doc) => {
              if (err) return res.status(400).json(err);
              request.remove();
              res.json(doc);
            });
          }
        );
      }
    );
  });
};

exports.reject_friend_request = (req, res, next) => {
  FriendRequest.findOneAndDelete(
    { _id: req.params.request_id },
    (err, request) => {
      if (err) return res.status(400).json(err);
      res.json(request);
    }
  );
};

exports.delete_friend = (req, res, next) => {
  /*
  FriendRequest.findById(req.params.request_id, (err, request) => {
    if(err) return res.status(400).json(err);
    User.findOneAndUpdate({_id: request.to}, {$pull: {friends: request.from}}, {new: true}, (err, doc) => {
      if(err) return res.status(400).json(err);
      User.findOneAndUpdate({_id: request.from}, {$pull: {friends: request.to}}, {}, (err, doc) => {
        if(err) return res.status(400).json(err); 
        res.sendStatus(200);
      })
    })
  })
  */
  const user1 = req.user.user_id;
  const user2 = req.params.user_id;
  User.findOneAndUpdate(
    { _id: user1 },
    { $pull: { friends: user2 } },
    {},
    (err) => {
      if (err) return res.status(400).json(err);
      User.findOneAndUpdate(
        { _id: user2 },
        { $pull: { friends: user1 } },
        {},
        (err) => {
          if (err) return res.status(400).json(err);
          res.sendStatus(200);
        }
      );
    }
  );
};
