import React from "react";
import {
  NotificationContainer,
  UserImage,
  DeleteButton,
} from "./Notification.components";
import { useHistory } from "react-router-dom";
import {
  useNotification,
  useClearNotification,
  useDeleteNotification,
} from "Hooks";

interface Props {
  id: string;
}

const Notification = ({ id }: Props) => {
  const notification = useNotification(id);

  const history = useHistory();

  const clearNotification = useClearNotification();
  const deleteNotification = useDeleteNotification();

  if (!notification) return null;

  const clickHandler = () => {
    clearNotification(id);
    history.push(notification.url);
  };

  const deleteHandler = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotification(id);
  };

  return (
    <NotificationContainer
      className="mb-1"
      onClick={() => clickHandler()}
      clicked={notification.clicked}
    >
      <UserImage
        className="mr-2"
        src={notification?.from?.profile_photo ?? "Unknown"}
      />
      <p className="mb-0">{notification?.message ?? ""}</p>
      <DeleteButton onClick={(e) => deleteHandler(e)} />
    </NotificationContainer>
  );
};

export default Notification;
