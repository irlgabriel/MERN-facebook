import React, { useState, useEffect } from "react";
import { TextInput, Button } from "flowbite-react";
import { CSSTransition } from "react-transition-group";
import { login } from "../store/auth";
import { LoadingOverlay } from "../Components";
import { useAppDispatch, useAppSelector } from "../hooks/utils";
import Link from "next/link";
import { useRouter } from "next/router";

const Index = () => {
  const { push } = useRouter();
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.auth.loading);
  const user = useAppSelector((state) => state.auth.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(undefined);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  useEffect(() => {
    if (user && typeof window !== undefined && localStorage.getItem("token"))
      push("/home");
  }, [user]);

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        setMessage(undefined);
      }, 3000);
    }
  }, [message]);

  return (
    <div id="index-main">
      <CSSTransition in={loading} timeout={300} classNames="fade" unmountOnExit>
        <LoadingOverlay />
      </CSSTransition>
      <CSSTransition in={message} timeout={300} classNames="fade" unmountOnExit>
        {/* <FlashMessage>{message}</FlashMessage> */}
      </CSSTransition>
      <div id="facebook-story">
        <img
          id="fb-logo"
          src="https://static.xx.fbcdn.net/rsrc.php/y1/r/4lCu2zih0ca.svg"
          alt="fb-logo"
        />
        <p>Connect with friends and the world around you on Facebook.</p>
      </div>
      <div className="flex flex-col items-center" id="index-login">
        <form className="w-full" onSubmit={(e) => submitHandler(e)}>
          <TextInput
            className="w-full mb-2"
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
          />
          <TextInput
            className="w-full mb-2"
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="********"
          />
          <Button
            size="sm"
            className="w-full mt-4 text-white text-3xl bg-blue-600 py-4 "
            type="submit"
          >
            Log In
          </Button>
        </form>
        <Link className="mt-2 w-full" href="/register">
          <Button
            className="w-full text-white  bg-slate-500 p-2"
            size="sm"
            color="none"
          >
            Create New Account
          </Button>
        </Link>
        <hr className="bg-black w-full my-6" />
        <a
          className="w-full "
          href={
            process.env.NODE_ENV === "development"
              ? "http://localhost:5000/auth/facebook"
              : "https://fcloneodin.herokuapp.com/auth/facebook"
          }
        >
          <Button
            className="w-full p-2 bg-slate-300 text-black"
            size="sm"
            color="blue"
          >
            Login with Facebook
          </Button>
        </a>
      </div>
    </div>
  );
};

export default Index;
