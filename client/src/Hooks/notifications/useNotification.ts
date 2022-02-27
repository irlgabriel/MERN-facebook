import { useSelector } from "Hooks";
import { Notification } from "Types";
import { selectNotification } from "Store/data/notifications";

export const useNotification = (id: string): Notification | null => {
  return useSelector((state) =>
    selectNotification(state.data.notifications, id)
  );
};
