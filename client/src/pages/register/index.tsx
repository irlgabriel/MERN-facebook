import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Form, Input, Label, Button } from "reactstrap";
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
    <div className="h-dvh w-full flex  justify-center flex-wrap">
      <div>
        <h3 className="text-center mb-auto">Create new account</h3>
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
          <div className="flex flex-col">
            <Label for="email">Email</Label>
            <input
              className="rounded-md"
              type="email"
              placeholder="Email.."
              name="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <Label for="first_name">First Name</Label>
            <input
              className="rounded-md"
              type="text"
              placeholder="First Name.."
              name="first_name"
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <Label for="last_name">Last Name</Label>
            <input
              className="rounded-md"
              type="text"
              placeholder="Last Name"
              name="last_name"
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <Label for="password">Password</Label>
            <input
              className="rounded-md"
              type="password"
              placeholder="********"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <Label for="password_conf">Password confirmation</Label>
            <input
              className="rounded-md"
              type="password"
              placeholder="********"
              name="password_conf"
              onChange={(e) => setConfirmPass(e.target.value)}
            />
          </div>
          <div className="flex flex-row justify-center items-center text-center">
            <Button
              type="submit"
              className="bg-blue-600 text-white p-2 border rounded-lg mt-2"
            >
              Register
            </Button>
            <Button
              onClick={() => push("/")}
              className="bg-slate-500 text-white p-2 border rounded-lg mt-2"
            >
              Back
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Register;
