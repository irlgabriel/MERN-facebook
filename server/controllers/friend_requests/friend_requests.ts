import { User } from "../../models/users";
import { FriendRequest, IFriendRequest } from "../../models/friend_request";
import { Notification } from "../../models/notifications";
import { RequestHandler } from "express";
import { RejectFriendRequestParams } from "./types";

export const get_friends_recommendations: RequestHandler = async (
  req,
  res,
  next
) => {
  // Need to further filter recommendations to hide those users toward whom the logged in
  // user has already sent friend requests.

  if (!req.user?.user_id) return;

  const user_id = req.user.user_id;

  try {
    // Find requests that this user sent.
    // NOTE: filtering due to previous bugs that lead to corrupting DB;
    const pendingSent = await FriendRequest.find({ from: { $eq: user_id } });
    const unavailableIds: string[] = [];
    unavailableIds.push(
      ...pendingSent.filter((d) => !!d).map((d) => d.to!.toString())
    );

    const pendingReceived = await FriendRequest.find({ to: user_id });
    unavailableIds.push(
      ...pendingReceived.filter((d) => !!d).map((d) => d.from!.toString())
    );

    const users = await User.find({
      friends: { $ne: req.user.user_id },
      _id: { $ne: req.user.user_id, $nin: unavailableIds },
    });
    res.json(users);
  } catch (e) {
    next(e);
  }
};

export const get_friends_requests: RequestHandler = async (req, res, next) => {
  try {
    const users = await FriendRequest.find({
      $or: [{ to: req.user.user_id }, { from: req.user.user_id }],
    }).populate(["to", "from"]);

    return res.json(users);
  } catch (e) {
    next(e);
  }
};

export const send_friend_request: RequestHandler = async (req, res, next) => {
  try {
    const request = (
      await FriendRequest.create({
        from: req.user.user_id,
        to: req.params.user_id,
      })
    ).populate(["to", "from"]);
    const from = await User.findById(req.user.user_id);
    const to = await User.findById(req.params.user_id);

    if (!from || !to) throw new Error("Could not find user!");

    await Notification.create({
      from,
      to,
      type: "friend_request",
      url: `/users/${from._id}`,
    });

    res.json(request);
  } catch (e) {
    next(e);
  }
};

export const accept_friend_request: RequestHandler = async (req, res, next) => {
  try {
    const request = await FriendRequest.findOne({ _id: req.params.request_id });

    if (!request) throw new Error("Could not find request!");

    // add this friend to each of the requests' users
    await User.findOneAndUpdate(
      { _id: request.from },
      { $push: { friends: request.to } }
    );
    await User.findOneAndUpdate(
      { _id: request.to },
      { $push: { friends: request.from } }
    );

    await request.deleteOne();
  } catch (e) {
    next(e);
  }
};

export const reject_friend_request: RequestHandler<
  RejectFriendRequestParams
> = async (req, res, next) => {
  try {
    const request = await FriendRequest.findOneAndDelete({
      _id: req.params.request_id,
    });
    if (!request) throw new Error("Could not find request!");
    res.json(request);
  } catch (e) {
    next(e);
  }
};

export const delete_friend: RequestHandler = async (req, res, next) => {
  const user1 = req.user.user_id;
  const user2 = req.params.user_id;

  try {
    await User.findOneAndUpdate({ _id: user1 }, { $pull: { friends: user2 } });
    await User.findOneAndUpdate({ _id: user2 }, { $pull: { friends: user1 } });
    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
};
