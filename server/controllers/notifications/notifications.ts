import { RequestHandler } from "express";
import { Notification } from "../../models/notifications";
import { DeleteNotificationParams } from "./types";

export const get_notification: RequestHandler = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ to: req.user.user_id })
      .sort("-createdAt")
      .populate(["to", "from"]);

    res.json(notifications);
  } catch (e) {
    next(e);
  }
};

export const delete_notification: RequestHandler<
  DeleteNotificationParams
> = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.notification_id,
    });

    res.json(notification);
  } catch (e) {
    next(e);
  }
};

export const delete_all: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?.user_id;
    if (!userId) throw new Error("Could not find User!");

    await Notification.deleteMany({ to: userId });
  } catch (e) {
    next(e);
  }
};

export const read_notification: RequestHandler = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.notification_id },
      { clicked: true }
    );

    if (!notification) throw new Error("Could not find notification!");
    res.json(notification);
  } catch (e) {
    next(e);
  }
};
