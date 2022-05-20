import moment from "moment";
import React, { useState, ReactEventHandler } from "react";
import {
  ReplyContainer,
  UserPhoto,
  ReplyBody,
  ReplyWrapper,
  ReplyFooter,
  FooterLink,
  LikesContainer,
} from "./Reply.components";
import { Form, Input, FormGroup } from "reactstrap";
import { AiFillLike } from "react-icons/ai";
import { Comment } from "Types";
import {
  useDeleteComment,
  useLikeComment,
  useEditComment,
  useCurrentUser,
} from "Hooks";

export interface Props {
  level?: number;
  reply: Comment;
}

const Reply = ({ reply }: Props) => {
  const [content, setContent] = useState<string>(reply.content);
  const [showEdit, setEdit] = useState<boolean>(false);

  const deleteComment = useDeleteComment();
  const editComment = useEditComment();
  const likeComment = useLikeComment();
  const user = useCurrentUser();

  const deleteHandler = () => {
    window.confirm(
      "Are you sure you want to delete this comment? This action cannot be undone."
    ) && deleteComment(reply.post._id, reply._id);
  };

  const likeHandler = () => {
    likeComment(reply.post._id, reply._id);
  };

  const editHandler: ReactEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    editComment(reply.post._id, reply._id, { content });
    setEdit(false);
  };

  const onChangeHandler = (target: HTMLInputElement) => {
    // Reset field height
    target.style.height = "inherit";

    // Get the computed styles for the element
    const computed = window.getComputedStyle(target);

    // Calculate the height
    const height =
      parseInt(computed.getPropertyValue("border-top-width"), 10) +
      parseInt(computed.getPropertyValue("padding-top"), 10) +
      target.scrollHeight +
      parseInt(computed.getPropertyValue("padding-bottom"), 10) +
      parseInt(computed.getPropertyValue("border-bottom-width"), 10);

    target.style.height = `${height}px`;
  };

  // THIS FUCKS THE HEIGHT UP;
  // useEffect(() => {
  //   const textarea = document.querySelector("textarea");
  //   if (textarea) {
  //     onChangeHandler(textarea);
  //   }
  // }, [showEdit]);

  if (!user) return null;

  return (
    <ReplyContainer>
      <UserPhoto className="mr-2" src={reply.user.profile_photo} />
      <ReplyWrapper className={"w-100"}>
        <ReplyBody>
          <h6 className="mb-0">
            {reply.user.display_name ||
              reply.user.first_name + " " + reply.user.last_name}
          </h6>
          {!showEdit ? (
            <div style={{ wordBreak: "break-word" }}>
              <p
                className="mb-0"
                dangerouslySetInnerHTML={{ __html: reply.content }}
              ></p>
              {/**@ts-ignore */}
              {reply.image && (
                <img width="100%" src={reply.image.url} alt="replier" />
              )}
            </div>
          ) : (
            <Form onSubmit={(e) => editHandler(e)} className="w-100">
              <FormGroup>
                <Input
                  type="textarea"
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    onChangeHandler(e.target);
                  }}
                />
              </FormGroup>
              <FormGroup className="text-right mb-1">
                <button type="submit" className="primary-button">
                  Edit
                </button>
              </FormGroup>
            </Form>
          )}
          {!showEdit && (
            <LikesContainer>
              <AiFillLike
                fill={
                  reply.likes.some((e) => e._id === user._id) ? "royalblue" : ""
                }
                size={12}
              />
              &nbsp;
              <p style={{ fontSize: "12px" }} className="d-inline-block mb-0">
                {reply.likes.length}
              </p>
            </LikesContainer>
          )}
        </ReplyBody>
        <ReplyFooter>
          <FooterLink
            color={
              reply.likes.some((e) => e._id === user._id)
                ? "royalblue"
                : "black"
            }
            onClick={() => likeHandler()}
            bold
          >
            Like
          </FooterLink>
          {user._id === reply.user._id && (
            <FooterLink bold onClick={() => deleteHandler()} color="gray">
              <span style={{ color: "black" }}>&middot;&nbsp;&nbsp;</span>
              Delete
            </FooterLink>
          )}
          {user._id === reply.user._id && (
            <FooterLink bold onClick={() => setEdit(!showEdit)} color="gray">
              Edit
            </FooterLink>
          )}
          <FooterLink color="lightgray">
            {moment(reply.createdAt).fromNow()}
          </FooterLink>
        </ReplyFooter>
      </ReplyWrapper>
    </ReplyContainer>
  );
};

export default Reply;