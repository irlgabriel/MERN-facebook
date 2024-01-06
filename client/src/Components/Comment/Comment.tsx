import moment from "moment";
import React, { useState, useEffect } from "react";
import { Reply } from "..";
import { AiFillLike } from "react-icons/ai";
import { BsArrow90DegDown } from "react-icons/bs";
import { ReplyForm } from "..";
import Link from "next/link";
import { User, isComment } from "../../Types/types";
import {
  deleteComment,
  editComment,
  getReplies,
  likeComment,
  selectReplies,
} from "../../Store/comments";
import { useAppDispatch, useAppSelector } from "../../Hooks/utils";
import { IComment } from "../../../../server/models/comments";
import { IPost } from "../../../../server/models/posts";
import { Button, FileInput, Textarea } from "flowbite-react";

interface Props {
  level?: number;
  comment: IComment;
  post: IPost;
}

const Comment = ({ level = 0, comment, post }: Props) => {
  const dispatch = useAppDispatch();

  const commentOwner = comment.user as any as User;
  const user = useAppSelector((state) => state.auth.user);

  const replies = useAppSelector((state) =>
    selectReplies(state.comments, comment._id)
  );
  const loading = useAppSelector((state) => state.comments.loading);
  const [file, setFile] = useState<File | null>(null);
  const [showReplyForm, setShowReply] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [content, setContent] = useState(comment.content ?? "");
  const [showEdit, setEdit] = useState(false);

  const deleteHandler = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this comment? This action cannot be undone."
      )
    ) {
      const postId = post._id;
      const commentId = comment._id;
      const parentCommentId = (
        isComment(comment?.comment) ? comment?.comment._id : comment._id
      ).toString();

      dispatch(
        deleteComment({
          postId,
          commentId,
          ...(comment?.comment ? { parentCommentId } : {}),
        })
      );
    }
  };

  const likeHandler = () => {
    if (loading) return;
    const postId = post._id;
    const commentId = comment._id;
    const parentCommentId = (
      isComment(comment?.comment) ? comment?.comment._id : comment._id
    ).toString();

    dispatch(
      likeComment({
        postId,
        commentId,
        ...(comment?.comment ? { parentCommentId } : {}),
      })
    );
  };

  const editHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (typeof content === "string") {
      formData.append("content", content);
    }
    if (file) formData.append("image", file);
    dispatch(
      editComment({ data: formData, comment: comment._id, post_id: post._id })
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
    if (showReplies) {
      dispatch(getReplies({ commentId: comment._id, postId: post._id }));
    }
  }, [showReplies]);

  useEffect(() => {
    const textarea = document.querySelector("textarea");
    if (textarea) {
      onChangeHandler(textarea);
    }
  }, [showEdit]);

  useEffect(() => {
    console.log({ commentOwner, likes: comment.likes });
  }, [comment.likes]);

  return (
    <div className="flex mt-1">
      <Link className="font-semibold" href={`/users/${commentOwner._id}`}>
        <img
          className="w-8 h-8 mr-2 rounded-2xl"
          src={commentOwner.profile_photo}
        />
      </Link>
      <div className={"p-1 flex-col w-full"}>
        <div className="p-2 relative rounded-lg w-full bg-slate-100">
          <h6 className="mb-0">
            {commentOwner.display_name ||
              commentOwner.first_name + " " + commentOwner.last_name}
          </h6>
          {!showEdit ? (
            <div className="w-full" style={{ wordBreak: "break-word" }}>
              <p
                className="mb-0"
                dangerouslySetInnerHTML={{ __html: comment.content ?? "" }}
              ></p>
              {comment.image && (
                <Link href={`/users/${comment.user}`}>
                  <img width="100%" src={comment.image.url} />
                </Link>
              )}
            </div>
          ) : (
            <form onSubmit={(e) => editHandler(e)} className="w-full pl-3">
              <Textarea
                placeholder="Content..."
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  onChangeHandler(e.target);
                }}
                className="mb-2"
              />
              <FileInput
                onChange={(e) => setFile(e.target?.files?.[0] ?? null)}
                name="image"
              />
              <em>Max 5MB (Accepted formats: jpg, jpeg, png)</em>
              <div className="w-full flex text-left">
                <Button
                  className="-ml-3"
                  color="primary"
                  type="submit"
                  size="sm"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => setEdit(false)}
                  type="button"
                  size="sm"
                  className="ml-2"
                  color="danger"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
          {!showEdit && (
            <div className="bg-white absolute rounded-md flex items-center px-1 -bottom-3 right-1">
              <AiFillLike
                fill={
                  comment.likes.some(
                    (like) => like._id.toString() === user?._id.toString()
                  )
                    ? "royalblue"
                    : ""
                }
                size={12}
              />
              <p className="text-xs font-size-2 inline-block ml-1 mb-0">
                {comment.likes.length}
              </p>
            </div>
          )}
        </div>
        <div className="flex items-center">
          <span
            className="font-semibold cursor-pointer mr-2 text-sm"
            color={
              //@ts-ignore
              comment.likes.some((e) => e._id === commentOwner._id)
                ? "royalblue"
                : "black"
            }
            onClick={() => likeHandler()}
          >
            Like
          </span>
          {level < 3 && (
            <span
              color=""
              className="font-semibold cursor-pointer text-sm"
              onClick={() => setShowReply(!showReplyForm)}
            >
              Reply
            </span>
          )}
          {user?._id === commentOwner._id && (
            <>
              <span
                className="pointer-events-none mx-2"
                style={{ color: "black" }}
              >
                &middot;
              </span>
              <span
                color=""
                className="font-semibold cursor-pointer mr-2 text-sm"
                onClick={() => deleteHandler()}
              >
                Delete
              </span>
              <span
                color=""
                className="font-semibold cursor-pointer mr-2 text-sm"
                onClick={() => setEdit(!showEdit)}
              >
                Edit
              </span>
            </>
          )}

          <span className="ml-1 text-xs text-slate-400">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {comment.commentsCount && !showReplies ? (
          <div
            onClick={() => setShowReplies(true)}
            className="cursor-pointer pl-3 pt-2 flex items-center"
          >
            <BsArrow90DegDown
              size={16}
              fill="black"
              className="mr-1"
              style={{ transform: "rotate(-90deg)" }}
            />
            <div className="select-none cursor-pointer mb-0 text-xs font-semibold">
              {comment.commentsCount} Replies
            </div>
          </div>
        ) : (
          ""
        )}
        {showReplies &&
          replies.map((reply) => (
            <Reply key={reply._id} reply={reply} comment={comment} />
          ))}
        {showReplyForm && (
          <ReplyForm key={comment._id} post={post} comment={comment} />
        )}
      </div>
    </div>
  );
};

export default Comment;
