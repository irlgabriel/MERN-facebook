import { useDispatch } from "react-redux";
import { useSelector } from "Hooks";
import {
  getNotifications,
  selectNotifications,
  ActionType,
} from "Store/data/notifications";
import { useActivity } from "Hooks";
import { Notification } from "Types";
import { ActivityError } from "Store/activities";

export const useNotifications = (): [
  { data: Notification[]; loading: boolean; error: ActivityError | null },
  () => void
] => {
  const dispatch = useDispatch();

  const [{ loading, error }] = useActivity(ActionType.GET_ALL);

  const data = useSelector((state) =>
    selectNotifications(state.data.notifications)
  );

  function handler() {
    dispatch(getNotifications());
  }

  return [{ data, loading, error }, handler];
};
