import { useDispatch } from "react-redux";
import { useSelector } from "Hooks";
import {
  getFriendSuggestions,
  selectFriendSuggestions,
  ActionType,
} from "Store/data/friend_requests";
import { useActivity } from "Hooks";
import { FriendRequest as Friend } from "Types";
import { ActivityError } from "Store/activities";

export const useFriendSuggestions = (): [
  { data: Friend[]; loading: boolean; error: ActivityError | null },
  () => void
] => {
  const dispatch = useDispatch();

  const [{ loading, error }] = useActivity(ActionType.GET_SUGGESTIONS);

  const data = useSelector((state) =>
    selectFriendSuggestions(state.data.friend_requests)
  );

  function handler() {
    dispatch(getFriendSuggestions());
  }

  return [{ data, loading, error }, handler];
};
