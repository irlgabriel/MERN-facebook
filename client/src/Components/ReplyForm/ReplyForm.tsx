import React from "react";
import Axios from "axios";
import { useState } from "react";
import { Form, Input, FormGroup, Button } from "reactstrap";
import { RoundImage, PhotoImage } from "./ReplyForm.components";
import { CSSTransition } from "react-transition-group";
import { Comment, Post, User } from "Types";

interface Props {
  user: User;
  comment: Comment;
  replies: Comment[];
  setReplies: (comments: Comment[]) => void;
  setShowReply: (show: boolean) => void;
  post: Post;
}

const ReplyForm = ({
  post,
  setShowReply,
  user,
  comment,
  replies,
  setReplies,
}: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState<string>("");
  const [showSubmit, setShowSubmit] = useState<boolean>(false);
  const [imageForm, setImageForm] = useState<boolean>(false);

  // prepended previously localStorage.getItem('token') &&
  const config = {
    headers: {
      Authorization: "bearer " + localStorage.getItem("token"),
    },
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("content", content);
    formData.append("comment", comment._id);
    if (file) formData.append("image", file);
    Axios.post<Comment>(`/posts/${post._id}/comments/`, formData, config)
      .then((res) => {
        setShowReply(false);
        setContent("");
        setReplies([res.data, ...replies]);
      })
      .catch((err) => console.log(err));
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Reset field height
    e.target.style.height = "inherit";

    // Get the computed styles for the element
    const computed = window.getComputedStyle(e.target);

    // Calculate the height
    const height =
      parseInt(computed.getPropertyValue("border-top-width"), 10) +
      parseInt(computed.getPropertyValue("padding-top"), 10) +
      e.target.scrollHeight +
      parseInt(computed.getPropertyValue("padding-bottom"), 10) +
      parseInt(computed.getPropertyValue("border-bottom-width"), 10);

    e.target.style.height = `${height}px`;
  };

  return (
    <Form onSubmit={(e) => submitHandler(e)}>
      <FormGroup className="mb-2 mt-1 d-flex align-items-center position-relative">
        <RoundImage className="mr-2" src={user.profile_photo} />
        <Input
          value={content}
          onFocus={() => setShowSubmit(true)}
          onChange={(e) => {
            setContent(e.target.value);
            onChangeHandler(e);
          }}
          placeholder="Reply.."
          rows={1}
          style={{ borderRadius: "16px", paddingRight: "3rem" }}
          type="textarea"
        />
        <PhotoImage
          size={24}
          fill="green"
          onClick={() => setImageForm(!imageForm)}
        />
      </FormGroup>
      <CSSTransition
        in={imageForm}
        timeout={300}
        classNames="fade"
        unmountOnExit
      >
        <FormGroup style={{ marginLeft: "48px" }}>
          <Input
            onChange={(e) =>
              setFile(e.target.files?.length ? e.target.files[0] : null)
            }
            type="file"
            name="image"
          />
          <em>Max 5MB (Accepted formats: jpg, jpeg, png)</em>
        </FormGroup>
      </CSSTransition>
      {showSubmit && (
        <FormGroup className="mb-0 text-right">
          <Button type="submit" size="sm">
            Reply
          </Button>
        </FormGroup>
      )}
    </Form>
  );
};

export default ReplyForm;
