import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import moment from "moment";
import { Form, Input, Button, FormGroup } from "reactstrap";
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
import { Link } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { Post as PostType, User } from "../../Types/types";
import { useAppDispatch, useAppSelector } from "../../Hooks/utils";
import { deletePost, editPost, likePost } from "../../Store/posts";
import { getComments, getReplies, selectComments } from "../../Store/comments";
import { RootState } from "../../Store/store";

interface Props {
  post: PostType;
}

const Post = ({ post }: Props) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user) as User;
  const commentIds = useAppSelector(
    (state) => state.comments.byPostId?.[post._id] ?? []
  );

  const comments = useAppSelector((state: RootState) =>
    selectComments(state.comments, commentIds)
  );

  const [fetchedComments, setFetchedComments] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState("");
  const [edit, setEdit] = useState(false);
  const [settingsDropdown, setSettingsDropdown] = useState(false);
  const [commentsDropdown, setCommentsDropdown] = useState(false);
  const [likesModal, setLikesModal] = useState(false);

  useEffect(() => {
    if (commentsDropdown && !fetchedComments) {
      dispatch(getComments(post._id));
      setFetchedComments(true);
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
    window.confirm(
      "Are you sure you want to delete this post? This action cannot be undone!"
    ) && dispatch(deletePost(post._id));
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

  // useEffect(() => {
  //   // GET Comments
  //   axios
  //     .get(`/posts/${post._id}/comments`)
  //     .then((res) => {
  //       setComments(res.data);
  //     })
  //     .catch((err) => console.log(err));
  //   //
  // }, []);

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
          to={postUser._id === user._id ? "/profile" : `/users/${postUser._id}`}
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
          <RoundedContainer>
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
        <Body>
          <p
            className="mb-1"
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></p>
          {post.image && post.image.url && (
            <img className="mb-2" width="100%" src={post.image?.url} />
          )}
        </Body>
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
                user={user}
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
