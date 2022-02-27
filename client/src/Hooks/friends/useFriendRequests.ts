import { useDispatch } from "react-redux";
import { useSelector } from "Hooks";
import {
  getFriendRequests,
  selectFriendRequests,
  ActionType,
} from "Store/data/friend_requests";
import { useActivity } from "Hooks";
import { FriendRequest as Friend } from "Types";
import { ActivityError } from "Store/activities";

export const useFriendRequests = (): [
  { data: Friend[]; loading: boolean; error: ActivityError | null },
  () => void
] => {
  const dispatch = useDispatch();

  const [{ loading, error }] = useActivity(ActionType.GET_ALL);

  const data = useSelector((state) =>
    selectFriendRequests(state.data.friend_requests)
  );

  function handler() {
    dispatch(getFriendRequests());
  }

  return [{ data, loading, error }, handler];
};
