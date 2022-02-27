import { Post } from "Types";
import { ThunkAction, ThunkDispatch as Dispatch } from "@reduxjs/toolkit";
import { ApplicationState, ApplicationActions } from "./root";

interface State {
  posts: Post[];
}

// Empty object should be ThunkContext;

export type Thunk = ThunkAction<
  Promise<void>,
  ApplicationState,
  {},
  ApplicationActions
>;
export type ThunkDispatch = Dispatch<ApplicationState, {}, ApplicationActions>;

export default State;
