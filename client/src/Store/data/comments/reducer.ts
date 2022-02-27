import produce from "immer";

import initialState from "./initialState";
import { Actions, State, ActionType } from "./types";

const reducer = (state: State = initialState, action: Actions): State => {
  switch (action.type) {
    case ActionType.GET_ALL: {
      const { comments } = action.payload;
      return produce(state, (draft) => {
        draft.comments = comments;
        comments.forEach((c) => {
          if (!draft.comments.map((d) => d._id).includes(c._id)) {
            draft.comments.push(c);
          }
          if (c.comment) {
            if (draft.byComment[c.comment._id]) {
              draft.byComment[c.comment._id].push(c);
            } else {
              draft.byComment[c.comment._id] = [c];
            }
          }

          if (!draft.byPost[c.post._id]) {
            draft.byPost[c.post._id] = [c];
          } else {
            draft.byPost[c.post._id].push(c);
          }
        });
      });
    }

    case ActionType.GET_POST_COMMENTS: {
      const { comments } = action.payload;
      return produce(state, (draft) => {
        comments.forEach((c) => {
          if (!draft.comments.map((d) => d._id).includes(c._id)) {
            draft.comments.push(c);
          }
          if (c.comment) {
            if (draft.byComment[c.comment._id]) {
              draft.byComment[c.comment._id].push(c);
            } else {
              draft.byComment[c.comment._id] = [c];
            }
          }

          if (!draft.byPost[c.post._id]) {
            draft.byPost[c.post._id] = [c];
          } else {
            draft.byPost[c.post._id].push(c);
          }
        });
      });
    }

    case ActionType.GET_REPLIES: {
      const { comments } = action.payload;

      return produce(state, (draft) => {
        comments.forEach((c) => {
          if (!draft.comments.map((d) => d._id).includes(c._id)) {
            draft.comments.push(c);
          }
          if (c.comment) {
            if (draft.byComment[c.comment._id]) {
              draft.byComment[c.comment._id].push(c);
            } else {
              draft.byComment[c.comment._id] = [c];
            }
          }

          if (!draft.byPost[c.post._id]) {
            draft.byPost[c.post._id] = [c];
          } else {
            draft.byPost[c.post._id].push(c);
          }
        });
      });
    }

    case ActionType.EDIT_COMMENT: {
      const { comment } = action.payload;

      return produce(state, (draft) => {
        if (comment.comment && comment.comment._id) {
          if (!draft.byComment[comment.comment._id]) {
            draft.byComment[comment.comment._id] = [comment];
          } else {
            draft.byComment[comment.comment._id].push(comment);
          }
        }

        if (comment.comment && comment.comment._id) {
          if (!draft.byComment[comment.comment._id]) {
            draft.byComment[comment.comment._id] = [comment];
          } else {
            draft.byComment[comment.comment._id] = draft.byComment[
              comment.comment._id
            ].map((c) => (c._id === comment._id ? comment : c));
          }
        }
      });
    }

    case ActionType.CREATE_COMMENT: {
      const { comment } = action.payload;
      return produce(state, (draft) => {
        if (comment.comment && comment.comment._id) {
          if (!draft.byComment[comment.comment._id]) {
            draft.byComment[comment.comment._id] = [comment];
          } else {
            draft.byComment[comment.comment._id].push(comment);
          }
        }

        if (comment.post._id) {
          if (!draft.byPost[comment.post._id]) {
            draft.byPost[comment.post._id] = [comment];
          } else {
            draft.byPost[comment.post._id].push(comment);
          }
        }
      });
    }
    case ActionType.DELETE_COMMENT: {
      return produce(state, (draft) => {
        const { comment } = action.payload;
        if (comment.comment && comment.comment._id) {
          if (draft.byComment[comment.comment._id]) {
            draft.byComment[comment.comment._id] = draft.byComment[
              comment.comment._id
            ].filter((d) => d._id !== comment._id);
          }
        }

        //@ts-ignore
        if (comment.post && comment.post) {
          //@ts-ignore
          if (draft.byPost[comment.post]) {
            //@ts-ignore
            draft.byPost[comment.post] = draft.byPost[
              //@ts-ignore
              comment.post
              //@ts-ignore
            ].filter((d) => d._id !== comment.post);
          }
        }
      });
    }

    case ActionType.LIKE_COMMENT: {
      const { comment } = action.payload;

      return produce(state, (draft) => {
        if (comment.comment && comment.comment._id) {
          if (!draft.byComment[comment.comment._id]) {
            draft.byComment[comment.comment._id] = [comment];
          } else {
            draft.byComment[comment.comment._id] = draft.byComment[
              comment.comment._id
            ].map((c) => (c._id === comment._id ? comment : c));
          }
        }

        if (comment.post._id) {
          if (!draft.byPost[comment.post._id]) {
            draft.byPost[comment.post._id] = [comment];
          } else {
            draft.byPost[comment.post._id] = draft.byPost[comment.post._id].map(
              (c) => (c._id === comment._id ? comment : c)
            );
          }
        }
      });
    }

    default: {
      return state;
    }
  }
};

export default reducer;
