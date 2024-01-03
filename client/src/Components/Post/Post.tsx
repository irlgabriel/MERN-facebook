import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { Form, Input, FormGroup } from "reactstrap";

import {
  PostContainer,
  RoundImage,
  Header,
  FlexContainer,
  Body,
  Footer,
  TopFooter,
  BottomFooter,
  RoundWrapper,
  FooterItem,
  RoundedContainer,
  RoundedWrapper,
  CommentsContainer,
  ClickDiv,
  FunctionalItem,
} from "./Post.components";
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
import { Post as PostType, User } from "../../Types/types";
import useOutsideClick, {
  useAppDispatch,
  useAppSelector,
} from "../../Hooks/utils";
import { deletePost, editPost, likePost } from "../../Store/posts";
import { getComments, selectCommentsByPost } from "../../Store/comments";
import { RootState } from "../../Store/store";
import Link from "next/link";
import { Button } from "flowbite-react";

interface Props {
  post: PostType;
}

const Post = ({ post }: Props) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user) as User;

  const comments = useAppSelector((state: RootState) =>
    selectCommentsByPost(state.comments, post._id)
  );
  const fetchedComments = useAppSelector((state) => state.comments.fetched);

  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState("");
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

  return (
    <PostContainer className="mb-2">
      <Header className="mb-2">
        <Link
          href={
            postUser._id === user._id ? "/profile" : `/users/${postUser._id}`
          }
        >
          <RoundImage src={postUser.profile_photo} />
        </Link>
        <FlexContainer>
          <div>
            <h4 className="mb-0">
              {postUser.display_name ||
                postUser.first_name + " " + postUser.last_name}
            </h4>
            <p style={{ fontSize: "13px" }} className="mb-0 text-muted">
              {moment(post.createdAt).fromNow()}
            </p>
          </div>
          {user._id === postUser._id && (
            <RoundedWrapper
              onClick={() => setSettingsDropdown(!settingsDropdown)}
            >
              <BsThreeDotsVertical size="24" />
            </RoundedWrapper>
          )}
        </FlexContainer>

        {/** Settings Dropdown  */}
        {settingsDropdown && (
          <RoundedContainer ref={expandedMenu}>
            <FunctionalItem
              onClick={() => {
                setEdit(true);
                setSettingsDropdown(false);
              }}
            >
              <AiFillEdit color="palegoldenrod" size={32} />
              &nbsp;Edit Post
            </FunctionalItem>
            <hr className="my-2" />
            <FunctionalItem onClick={() => deleteHandler()}>
              <AiFillDelete color="red" size={32} />
              &nbsp;Delete Post
            </FunctionalItem>
          </RoundedContainer>
        )}
      </Header>
      {!edit && (
        <div className="flex">
          <p
            className="mb-1"
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></p>
          {post.image && post.image.url && (
            <img className="mb-2" width="100%" src={post.image?.url} />
          )}
        </div>
      )}
      {edit && (
        <Form onSubmit={(e) => editHandler(e)}>
          <FormGroup>
            <Input
              placeholder="Content..."
              type="textarea"
              onFocus={(e) => onChangeHandler(e)}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                onChangeHandler(e);
              }}
            />
          </FormGroup>
          <FormGroup style={{ marginLeft: "12px" }}>
            <Input
              onChange={(e) => setFile(e.target?.files?.[0] ?? null)}
              type="file"
              name="image"
            />
            <em>Max 5MB (Accepted formats: jpg, jpeg, png)</em>
          </FormGroup>
          <FormGroup className="d-flex align-items-center">
            <Button
              className="ml-auto mr-2"
              type="submit"
              color="primary"
              size="sm"
            >
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
          </FormGroup>
        </Form>
      )}
      <Footer>
        <TopFooter>
          <ClickDiv onClick={() => setLikesModal(true)} className="d-flex">
            <RoundWrapper className="mr-1" bgColor="royalblue">
              <AiFillLike
                data-toggle="tooltip"
                data-html="true"
                size={12}
                fill="white"
              />
            </RoundWrapper>
            <p style={{ fontSize: "14px" }} className="mb-0">
              {post.likes.length}
            </p>
          </ClickDiv>
          <ClickDiv onClick={() => setCommentsDropdown(!commentsDropdown)}>
            <p className="mb-0">{post.commentsCount} Comments</p>
          </ClickDiv>
        </TopFooter>
        <hr className="my-1" />
        <BottomFooter>
          <FooterItem onClick={() => like()}>
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
          </FooterItem>
          <FooterItem onClick={() => setCommentsDropdown(!commentsDropdown)}>
            <VscComment size={20} />
            &nbsp;Comment
          </FooterItem>
        </BottomFooter>
      </Footer>

      {/** Comment dropdown */}
      {commentsDropdown && (
        <CommentsContainer>
          <hr className="my-1" />
          {comments
            .filter((comment) => !comment.hasOwnProperty("comment"))
            .map((comment) => (
              <Comment
                //@ts-ignore
                key={comment._id}
                comments={comments}
                post={post}
                comment={comment}
              />
            ))}
          <CommentForm post={post} user={user} comments={comments} />
        </CommentsContainer>
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
    </PostContainer>
  );
};

export default Post;
