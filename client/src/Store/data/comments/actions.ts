import { Comment } from "Types";
import { ActionType, GetCommentsAction, GetPostCommentsAction } from "./types";
import { Thunk } from "Store/types";
import axios from "axios";

const getCommentsAction = (comments: Comment[]): GetCommentsAction => ({
  type: ActionType.GET_ALL,
  payload: { comments },
});

export const getComments = (): Thunk => async (dispatch) => {
  try {
    const { data } = await axios.get<Comment[]>("/comments");
    dispatch(getCommentsAction(data));
  } catch (e: any) {
    throw new Error("failed to fetch comments");
  }
};
