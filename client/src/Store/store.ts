import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { ThunkDispatch } from "./types";
// import { factory } from

import reducer from "./root";

const configureStore = () => {
  const middleware = composeWithDevTools(applyMiddleware(thunk));

  const store = createStore(reducer, middleware);

  return store;
};

export const store = configureStore();
