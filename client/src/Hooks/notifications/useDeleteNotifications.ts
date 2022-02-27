import { useDispatch } from "react-redux";
import { deleteNotifications } from "Store/data/notifications";

export const useDeleteNotifications = () => {
  const dispatch = useDispatch();

  return () => dispatch(deleteNotifications());
};
