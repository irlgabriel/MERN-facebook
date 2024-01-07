//@ts-nocheck
import moment from "moment";
import React, { useState, useEffect } from "react";
import {
  ReplyContainer,
  UserPhoto,
  ReplyBody,
  ReplyWrapper,
  ReplyFooter,
  FooterLink,
  LikesContainer,
} from "./Reply.components";
import { Form, Input, Button, FormGroup } from "reactstrap";
import { AiFillLike } from "react-icons/ai";

import { deleteComment, editComment, likeComment } from "../../store/comments";
import { useAppDispatch, useAppSelector } from "../../hooks/utils";
import { selectPostById } from "../../store/posts";
import { selectUserById } from "../../store/users";
import { IComment } from "../../../../server/models/comments";
import { isUser } from "../../types/types";

interface Props {
  reply: IComment;
  comment: IComment;
}

const Reply = ({ reply, comment }: Props) => {
  const dispatch = useAppDispatch();

  useAppSelector((state) => selectPostById(state.posts, comment.post));
  const post = useAppSelector((state) => state.posts);
  const userId = (isUser(reply.user) ? reply.user._id : reply.user)?.toString();

  const user = useAppSelector((state) => selectUserById(state.users, userId));
  const commentOwner = useAppSelector((state) =>
    selectUserById(state.auth, userId)
  );

  const [content, setContent] = useState(reply.content);
  const [showEdit, setEdit] = useState(false);

  const deleteHandler = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this comment? This action cannot be undone."
      )
    ) {
      dispatch(deleteComment({}));
    }
  };

  const likeHandler = () => {
    dispatch(likeComment({ postId: reply.post, commentId: reply._id }));
  };

  const editHandler = (e) => {
    e.preventDefault();
    dispatch(
      editComment({ content, comment: comment._id, post_id: reply.post })
    );
  };

  const onChangeHandler = (target) => {
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

  useEffect(() => {
    const textarea = document.querySelector("textarea");
    if (textarea) {
      onChangeHandler(textarea);
    }
  }, [showEdit]);

  return (
    <ReplyContainer>
      <UserPhoto className="mr-2" src={user?.profile_photo} />
      <ReplyWrapper className={"w-100"}>
        <ReplyBody>
          <h6 className="mb-0">
            {user?.display_name || user?.first_name + " " + user?.last_name}
          </h6>
          {!showEdit ? (
            <div style={{ wordBreak: "break-word" }}>
              <p
                className="mb-0"
                dangerouslySetInnerHTML={{ __html: reply.content }}
              ></p>
              {reply.image && <img width="100%" src={reply.image.url} />}
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
                <Button color="primary" type="submit" size="sm">
                  Edit
                </Button>
              </FormGroup>
            </Form>
          )}
          {!showEdit && (
            <LikesContainer className="flex items-center">
              <AiFillLike
                className="mr-1"
                fill={
                  reply.likes.some((e) => e._id === user?._id)
                    ? "royalblue"
                    : ""
                }
                size={12}
              />
              <p style={{ fontSize: "12px" }} className="d-inline-block mb-0">
                {reply.likes.length}
              </p>
            </LikesContainer>
          )}
        </ReplyBody>
        <ReplyFooter>
          <span
            className="text-sm mr-1 font-semibold cursor-pointer"
            color={
              reply.likes.some((e) => e._id === user?._id)
                ? "royalblue"
                : "black"
            }
            onClick={() => likeHandler()}
            bold
          >
            Like
          </span>
          {commentOwner?._id === user?._id && (
            <span bold onClick={() => deleteHandler()} color="gray">
              <span style={{ color: "black" }}>&middot;&nbsp;&nbsp;</span>
              Delete
            </span>
          )}
          {commentOwner?._id === user?._id && (
            <span bold onClick={() => setEdit(!showEdit)} color="gray">
              Edit
            </span>
          )}
          <span className="text-xs text-slate-400">
            {moment(reply.createdAt).fromNow()}
          </span>
        </ReplyFooter>
      </ReplyWrapper>
    </ReplyContainer>
  );
};

export default Reply;
