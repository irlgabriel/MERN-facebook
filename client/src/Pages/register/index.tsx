import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Form, Input, Label, FormGroup, Button } from "reactstrap";
import { CSSTransition } from "react-transition-group";
import Link from "next/link";
import { useRouter } from "next/router";

const Register = ({ user, reloadUser, getUser }) => {
  const { push } = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [message, setMessage] = useState("");

  const submitHandler = (e) => {
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
        push("/");
      })
      .catch((err) => {
        setMessage(err.response.data.message);
      });
  };

  useEffect(() => {
    if (user) push("/home");
  }, [user]);

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
      <Link href="/">Back</Link>
      <h3 className="text-center">Register</h3>
      <CSSTransition
        in={message !== ""}
        timeout={300}
        classNames="fade"
        unmountOnExit
      >
        <div className="w-3/4 bg-slate-500 p-2 my-2 mx-0 text-white">
          {message}
        </div>
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
          <Button type="submit" color="primary">
            Register
          </Button>
        </FormGroup>
      </Form>
    </Container>
  );
};

export default Register;
