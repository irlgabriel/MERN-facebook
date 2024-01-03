import {
  NotificationContainer,
  UserImage,
  DeleteButton,
} from "./Notification.components";
import React, { PropsWithChildren } from "react";
import { Notification as NotificationType } from "../../Types/types";
import { useRouter } from "next/router";
import { clearNotification, readNotification } from "../../Store/notifications";
import { useAppDispatch } from "../../Hooks/utils";

type Props = PropsWithChildren<{
  notification: NotificationType;
}>;

const Notification = ({ notification }: Props) => {
  const { push } = useRouter();

  const dispatch = useAppDispatch();

  const clickHandler = () => {
    dispatch(readNotification(notification._id));
    push(notification.url);
  };

  const deleteHandler = (e) => {
    e.stopPropagation();
    dispatch(clearNotification(notification._id));
  };

  return (
    <NotificationContainer
      className="mb-1"
      onClick={() => clickHandler()}
      clicked={notification.clicked}
    >
      <UserImage
        className="mr-2"
        //@ts-ignore
        src={notification?.from?.profile_photo ?? "Unknown"}
      />
      <p className="mb-0">{notification?.message ?? ""}</p>
      <DeleteButton onClick={(e) => deleteHandler(e)} />
    </NotificationContainer>
  );
};

export default Notification;
