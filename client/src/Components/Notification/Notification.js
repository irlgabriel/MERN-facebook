import {
  NotificationContainer,
  UserImage,
  DeleteButton,
} from "./Notification.components";
import { useHistory } from "react-router-dom";
import axios from "axios";

const Notification = ({ notification, notifications, setNotifications }) => {
  const history = useHistory();

  const config = localStorage.getItem('token') &&  {
    headers: {
      Authorization: "bearer " + localStorage.getItem("token"),
    },
  };

  const clickHandler = () => {
    axios.put(`/notifications/${notification._id}`, {}, config).then((res) => {
      setNotifications(
        notifications.map((notification) =>
          notification._id === res.data._id ? res.data : notification
        )
      );
      history.push(notification.url);
    });
  };

  const deleteHandler = (e) => {
    e.stopPropagation();
    axios.delete(`/notifications/${notification._id}`, config).then((res) => {
      setNotifications(
        notifications.filter(
          (notification) => notification._id !== res.data._id
        )
      );
    });
  };

  return (
    <NotificationContainer
      className="mb-1"
      onClick={() => clickHandler()}
      clicked={notification.clicked}
    >
      <UserImage className="mr-2" src={notification.from.profile_photo} />
      <p className="mb-0">{notification.message}</p>
      <DeleteButton onClick={(e) => deleteHandler(e)} />
    </NotificationContainer>
  );
};

export default Notification;
