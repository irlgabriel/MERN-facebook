import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Link, useHistory } from "react-router-dom";
import { Container, Form, Input, Button, FormGroup } from "reactstrap";
import { FlashMessage } from "./Index.components";
import { CSSTransition } from "react-transition-group";
import { LoadingOverlay } from "../../Components";

const Index = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    Axios.post("/login", { email, password })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        setLoading(false);
      })
      .catch((err) => {
        setMessage(err.response.data.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  }, [message]);

  return (
    <Container id="index-main">
      <CSSTransition in={loading} timeout={300} classNames="fade" unmountOnExit>
        <LoadingOverlay />
      </CSSTransition>
      <CSSTransition
        in={!!message}
        timeout={300}
        classNames="fade"
        unmountOnExit
      >
        <FlashMessage>{message}</FlashMessage>
      </CSSTransition>
      <div id="facebook-story">
        <img
          id="fb-logo"
          src="https://static.xx.fbcdn.net/rsrc.php/y8/r/dF5SId3UHWd.svg"
          alt="fb-logo"
        />
        <p>Connect with friends and the world around you on Facebook.</p>
      </div>
      <div id="index-login">
        <Form onSubmit={(e) => submitHandler(e)}>
          <FormGroup>
            <Input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
            />
          </FormGroup>
          <FormGroup>
            <Input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="********"
            />
          </FormGroup>
          <FormGroup>
            <Button
              style={{ fontSize: "20px" }}
              color="primary"
              className="font-weight-bold py-2 w-100"
            >
              Log In
            </Button>
          </FormGroup>
        </Form>
        <div className="d-flex align-items-center justify-content-between">
          <hr className="w-100" />
          <p className="mb-1 mx-2">or</p>
          <hr className="w-100" />
        </div>
        <Container className="w-75">
          <Link to="/register">
            <Button className="w-100 py-2 font-weight-bold" color="success">
              Create New Account
            </Button>
          </Link>
        </Container>
        <div className="d-flex align-items-center justify-content-between">
          <hr className="w-100" />
          <p className="mb-1 mx-2">or</p>
          <hr className="w-100" />
        </div>
        <div className="text-center mt-2">
          <a
            href={
              process.env.NODE_ENV === "development"
                ? "http://localhost:5000/auth/facebook"
                : "https://fcloneodin.herokuapp.com/auth/facebook"
            }
          >
            <Button color="primary">Login with Facebook</Button>
          </a>
        </div>
      </div>
    </Container>
  );
};

export default Index;
