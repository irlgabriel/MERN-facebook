import { useDispatch } from "react-redux";
import { getComments } from "Store/data/comments";

export const useComments = () => {
  const dispatch = useDispatch();

  function handler() {
    dispatch(getComments());
  }

  return [{}, handler];
};
