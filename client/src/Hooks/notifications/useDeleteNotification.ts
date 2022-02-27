import { useDispatch } from "react-redux";
import { deleteNotification } from "Store/data/notifications";

export const useDeleteNotification = () => {
  const dispatch = useDispatch();

  return (id: string) => dispatch(deleteNotification(id));
};
