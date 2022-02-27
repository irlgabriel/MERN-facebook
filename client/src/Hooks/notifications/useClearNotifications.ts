import { useDispatch } from "react-redux";
import { clearNotifications } from "Store/data/notifications";

export const useClearNotifications = () => {
  const dispatch = useDispatch();

  return () => dispatch(clearNotifications());
};
