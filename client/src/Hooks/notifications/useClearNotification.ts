import { useDispatch } from "react-redux";
import { clearNotification } from "Store/data/notifications";

export const useClearNotification = () => {
  const dispatch = useDispatch();

  return (id: string) => dispatch(clearNotification(id));
};
