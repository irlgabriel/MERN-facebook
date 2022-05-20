import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Form, Input, Label, FormGroup } from "reactstrap";
import { FlashMessage } from "./Register.components";
import { CSSTransition } from "react-transition-group";
import { Link, useHistory } from "react-router-dom";

interface Props {
  reloadUser: () => void;
  getUser: (s: string) => void;
}

const Register = ({ reloadUser, getUser }: Props) => {
  const location = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [message, setMessage] = useState<string>("");

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPass) {
      setMessage("Passwords do not match");
      return;
    }
    axios
      .post("/register", {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      })
      .then((res) => {
        localStorage.setItem("token", res.data);
        getUser(res.data);
        location.push("/");
      })
      .catch((err) => {
        console.log(err.response);
        setMessage(err.response.data.message);
      });
  };

  // Clear message after 3s
  useEffect(() => {
    setTimeout(() => {
      if (message) setMessage("");
    }, 3000);
  }, [message]);

  return (
    <Container
      style={{ width: "600px", paddingTop: "60px", minHeight: "100vh" }}
    >
      <Link to="/">Back</Link>
      <h3 className="text-center">Register</h3>
      <CSSTransition
        in={!!message}
        timeout={300}
        classNames="fade"
        unmountOnExit
      >
        <FlashMessage>{message}</FlashMessage>
      </CSSTransition>
      <Form onSubmit={(e) => submitHandler(e)}>
        <FormGroup>
          <Label for="email">Email</Label>
          <Input
            type="email"
            placeholder="Email.."
            name="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="first_name">First Name</Label>
          <Input
            type="text"
            placeholder="First Name.."
            name="first_name"
            onChange={(e) => setFirstName(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="last_name">Last Name</Label>
          <Input
            type="text"
            placeholder="Last Name"
            name="last_name"
            onChange={(e) => setLastName(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="password">Password</Label>
          <Input
            type="password"
            placeholder="********"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="password_conf">Password confirmation</Label>
          <Input
            type="password"
            placeholder="********"
            name="password_conf"
            onChange={(e) => setConfirmPass(e.target.value)}
          />
        </FormGroup>
        <FormGroup className="text-center">
          <button type="submit" className="primary-button">
            Register
          </button>
        </FormGroup>
      </Form>
    </Container>
  );
};

export default Register;