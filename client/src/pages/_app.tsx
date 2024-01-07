import React from "react";
import Head from "next/head";
import { GlobalStyle } from "./_app.css";
import { Provider } from "react-redux";
import store from "../Store/store";
import "tailwindcss/tailwind.css";

const App = ({ Component }: { Component: React.FC }) => {
  return (
    <React.Fragment>
      <GlobalStyle />
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Facebook</title>
      </Head>
      <Provider store={store}>
        <Component />
      </Provider>
    </React.Fragment>
  );
};

export default App;
