import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
@tailwind base;
@tailwind components;
@tailwind utilities;
body {
  background: rgb(240, 242, 245);
}

img {
  max-width: inherit;
}

#index-main {
  hr {
    height: 1px;
  }
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-top: 120px;
  width: min(980, 100%);
}

#facebook-story {
  width: 580px;
  padding-right: 2rem;
}

#facebook-story p {
  font-size: 26px;
  margin-top: 10px;
  line-height: 1.2;
}

#index-login {
  width: 380px;
  padding: 1rem;
  border-radius: 6px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1);
}

#fb-logo {
  height: 106px;
  margin: -28px;
}

@media only screen and (max-width: 980px) {
  #index-main {
    padding-top: 60px;
    flex-direction: column;
    justify-content: flex-start;
  }
  #index-login {
    margin-top: 40px;
  }
  #facebook-story {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 400px;
  }
  #facebook-story p {
    text-align: center;
    font-size: 20px;
  }
}
.row {
  justify-content: space-between;
  /*min-height: 800px;*/
}

textarea {
  resize: none !important;
}
.box-shadow-right {
  box-shadow: 3px 0px 15px 1px rgba(0, 0, 0, 0.41);
}

#friends-col {
  z-index: 2;
  height: calc(100vh - 55px);
  overflow: scroll;
}
#friends-profile {
  height: calc(100vh - 55px);
  overflow: scroll;
}
#right-col {
  padding: 0.5rem 0.25rem 0.5rem 2.25rem;
}

/* hide scrollbars */
::-webkit-scrollbar {
  width: 0px; /* Remove scrollbar space */
  background: transparent; /* Optional: just make scrollbar invisible */
}

input[type='text'], textarea {
  height: 36px;
}

/* react-transition-group animation classnames */

.slide-from-top-enter {
  margin-top: -20%;
}
.slide-from-top-enter-active {
  margin-top: 0;
  transition: all 0.5s ease-in-out;
}
.slide-from-top-exit {
  margin-top: 0;
}
.slide-from-top-exit-active {
  margin-top: -20%;
  transition: all 0.5s ease-in-out;
}

.fade-enter {
  opacity: 0;
}
.fade-enter-active {
  transition: all 0.3s ease-in-out;
  opacity: 1;
}
.fade-exit {
  opacity: 1;
}
.fade-exit-active {
  opacity: 0;
  transition: all 0.3s ease-in-out;
}

/* Media queries */

@media screen and (max-width: 768px) {
  #nav-mid {
    display: none !important;
  }
}
`;
