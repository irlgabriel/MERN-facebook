import React, { useState } from "react";
import { Form, Input, FormGroup, Button } from "reactstrap";
import { RoundImage, PhotoImage } from "./ReplyForm.components";
import { CSSTransition } from "react-transition-group";
import { createComment } from "../../store/comments";
import { useAppDispatch, useAppSelector } from "../../hooks/utils";
import { IPost } from "../../../../server/models/posts";
import { IComment } from "../../../../server/models/comments";

interface Props {
  post: IPost;
  comment: IComment;
}

const ReplyForm = ({ post, comment }: Props) => {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);

  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState("");
  const [showSubmit, setShowSubmit] = useState(false);
  const [imageForm, setImageForm] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("content", content);
    formData.append("comment", comment._id);
    if (file) formData.append("image", file);
    dispatch(
      createComment({ data: formData, comment: comment._id, post_id: post._id })
    );
  };

  const onChangeHandler = (e) => {
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
      <FormGroup className="mb-2 mt-1 lex items-center relative">
        <RoundImage className="mr-2" src={user?.profile_photo} />
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
            onChange={(e) => setFile(e.target?.files?.[0] ?? null)}
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
