import React, { useEffect, useRef, useState } from "react";
import moment from "moment";

import { Comment, CommentForm, LikesModal } from "..";
import {
  AiFillLike,
  AiOutlineLike,
  AiFillDelete,
  AiFillEdit,
} from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { VscComment } from "react-icons/vsc";
import { CSSTransition } from "react-transition-group";
import { User } from "../../types/types";
import useOutsideClick, {
  useAppDispatch,
  useAppSelector,
} from "../../hooks/utils";
import { deletePost, editPost, likePost } from "../../store/posts";
import { getComments, selectCommentsByPost } from "../../store/comments";
import { RootState } from "../../store/store";
import Link from "next/link";
import { Button, Dropdown, FileInput, Textarea } from "flowbite-react";
import { IPost } from "../../../../server/models/posts";
import { IUser } from "../../../../server/models/users";
import { ImageWithFallback } from "../ImageWithFallback/ImageWithFallback";

interface Props {
  post: IPost;
}

const Post = ({ post }: Props) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user) as IUser;

  const comments = useAppSelector((state: RootState) =>
    selectCommentsByPost(state.comments, post._id)
  );
  const fetchedComments = useAppSelector((state) => state.comments.fetched);

  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState(post.content ?? "");
  const [edit, setEdit] = useState(false);
  const [settingsDropdown, setSettingsDropdown] = useState(false);
  const [commentsDropdown, setCommentsDropdown] = useState(false);
  const [likesModal, setLikesModal] = useState(false);

  const expandedMenu = useRef<HTMLDivElement>(null);

  useOutsideClick([expandedMenu], () => {
    setSettingsDropdown(false);
  });

  useEffect(() => {
    if (commentsDropdown && !fetchedComments) {
      dispatch(getComments(post._id));
    }
  }, [commentsDropdown, fetchedComments, post]);

  // MONGODB POPULATED!
  //@ts-ignore
  const postUser = post.user as User;

  const editHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("content", content);
    if (file) formData.append("image", file);
    dispatch(editPost(formData as Partial<{ image: any; content: string }>));
  };

  const deleteHandler = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this post? This action cannot be undone!"
      )
    ) {
      dispatch(deletePost(post._id));
      setSettingsDropdown(false);
    }
  };

  const like = () => {
    dispatch(likePost(post._id));
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

  useEffect(() => {
    const textarea = document.querySelector("textarea");
    if (textarea) {
      textarea.style.height = "inherit";
      const computed = window.getComputedStyle(textarea);
      const height =
        parseInt(computed.getPropertyValue("border-top-width"), 10) +
        parseInt(computed.getPropertyValue("padding-top"), 10) +
        textarea.scrollHeight +
        parseInt(computed.getPropertyValue("padding-bottom"), 10) +
        parseInt(computed.getPropertyValue("border-bottom-width"), 10);
      textarea.style.height = height + "px";
    }
  }, [edit]);

  const likedPost = true;

  return (
    <div className="bg-white py-2 px-4 rounded shadow-lg mb-2">
      <div className="flex items-center relative mb-2">
        <Link className="mr-2" href={`/users/${postUser._id}`}>
          <img
            className=" rounded-full w-12 h-12"
            src={postUser.profile_photo}
          />
        </Link>
        <div className="flex items-center justify-between w-full">
          <div>
            <h4 className="mb-0">
              {postUser.display_name ||
                postUser.first_name + " " + postUser.last_name}
            </h4>
            <p
              style={{ fontSize: "13px" }}
              className="mb-0 text-sm text-slate-400"
            >
              {moment(post.createdAt).fromNow()}
            </p>
          </div>
          {user?._id === postUser?._id && (
            <Dropdown
              dir="right"
              renderTrigger={() => (
                <div className="bg-slate-100 cursor-pointer rounded-full w-8 h-8 flex items-center justify-center hover:bg-slate-300">
                  <BsThreeDotsVertical size="24" />
                </div>
              )}
              label=""
            >
              <Dropdown.Item
                onClick={() => {
                  setEdit(true);
                  setSettingsDropdown(false);
                }}
              >
                <AiFillEdit color="palegoldenrod" size={16} />
                &nbsp;Edit Post
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => deleteHandler()}>
                <AiFillDelete color="red" size={16} />
                &nbsp;Delete Post
              </Dropdown.Item>
            </Dropdown>
          )}
        </div>
      </div>
      {!edit && (
        <div className="flex flex-col">
          <p
            className="mb-1"
            dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
          ></p>
          {post.image && post.image.url && (
            <img className="w-full h-auto p-2" src={post.image?.url} />
          )}
        </div>
      )}
      {edit && (
        <form className=" pl-3" onSubmit={(e) => editHandler(e)}>
          <Textarea
            className="mb-2"
            placeholder="Content..."
            onFocus={(e) => onChangeHandler(e)}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              onChangeHandler(e);
            }}
          />
          <FileInput
            onChange={(e) => setFile(e.target?.files?.[0] ?? null)}
            name="image"
          />
          <em>Max 5MB (Accepted formats: jpg, jpeg, png)</em>
          <div className="flex text-left">
            <Button className="-ml-3" type="submit" color="primary" size="sm">
              Edit
            </Button>
            <Button
              type="button"
              onClick={() => setEdit(false)}
              color="danger"
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
      <div className="flex-col">
        <div className="flex items-center justify-between">
          <div
            className="flex cursor-pointer"
            onClick={() => setLikesModal(true)}
          >
            {/**@ts-ignore */}
            <div
              className={`mr-1 rounded-full w-5 h-5 ${
                likedPost ? "bg-blue-500" : "bg-slate-400"
              } flex items-center justify-center`}
            >
              <AiFillLike
                data-toggle="tooltip"
                data-html="true"
                size={12}
                fill="white"
              />
            </div>
            <p style={{ fontSize: "14px" }} className="mb-0">
              {post.likesCount}
            </p>
          </div>
          <div
            className="cursor-pointer"
            onClick={() => setCommentsDropdown(!commentsDropdown)}
          >
            <p className="mb-0">{post.commentsCount} Comments</p>
          </div>
        </div>
        <hr className="my-1" />
        <div className="items-center flex">
          <div
            className="w-2/4 rounded-md bg-white flex items-center justify-center font-bold text-gray-600 p-2 hover:bg-slate-100 cursor-pointer"
            onClick={() => like()}
          >
            {/*@ts-ignore*/}
            {!post.likes.some((e) => e._id === user._id) ? (
              <div style={{ display: "flex", alignItems: "center" }}>
                <AiOutlineLike size={20} />
                <span>&nbsp;Like</span>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center" }}>
                <AiFillLike size={20} fill="royalblue" />
                <span style={{ color: "royalblue" }}>&nbsp;Liked</span>
              </div>
            )}
          </div>
          <div
            className="w-2/4 rounded-md bg-white flex items-center justify-center font-bold text-gray-600 p-2 hover:bg-slate-100 cursor-pointer"
            onClick={() => setCommentsDropdown(!commentsDropdown)}
          >
            <VscComment size={20} />
            &nbsp;Comment
          </div>
        </div>
      </div>

      {/** Comment dropdown */}
      {commentsDropdown && (
        <div>
          <hr className="my-1" />
          {comments
            .filter((comment) => !comment.hasOwnProperty("comment"))
            .map((comment) => (
              <Comment key={comment._id} post={post} comment={comment} />
            ))}
          <CommentForm post={post} user={user} comments={comments} />
        </div>
      )}

      {/* Likes Modal (absolutely positioned) */}
      <CSSTransition
        in={likesModal}
        timeout={300}
        classNames="fade"
        unmountOnExit
      >
        <LikesModal setLikesModal={setLikesModal} likes={post.likes} />
      </CSSTransition>
    </div>
  );
};

export default Post;
