import React, { useEffect, useState } from "react";
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
import { Link, useParams } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import {
  useEditPost,
  useRemovePost,
  useLikePost,
  useCurrentUser,
  useGetPost,
  useComments,
} from "Hooks";

interface Props {
  id?: string;
}

const Post = ({ id }: Props) => {
  const { post_id } = useParams<{ post_id: string }>();
  const user = useCurrentUser();
  const [{ data: post }, getPost] = useGetPost(id ?? post_id);
  const [, editPost] = useEditPost(id ?? post_id);
  const deletePost = useRemovePost(id ?? post_id);
  const likePost = useLikePost(id ?? post_id);
  const [{ data: comments }, getComments] = useComments(id ?? post_id);

  const [file, setFile] = useState<File | null>(null /*post.image*/);
  const [content, setContent] = useState("");
  const [edit, setEdit] = useState(false);
  const [settingsDropdown, setSettingsDropdown] = useState(false);
  const [commentsDropdown, setCommentsDropdown] = useState(false);
  const [likesModal, setLikesModal] = useState(false);

  useEffect(() => {
    !post && getPost(id || post_id);
    getComments(id || post_id);
  }, []);

  const editHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("content", content);
    if (file) formData.append("image", file);

    // @ts-ignore formdata cant have a shape as far as I know
    editPost({ id: post._id, post: formData });
    setEdit(false);
  };

  const deleteHandler = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this post? This action cannot be undone!"
      )
    ) {
      deletePost();
      setSettingsDropdown(false);
    }
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

  if (!user || !post) {
    console.log("user or post undefined", user, post);
    return null;
  }

  return (
    <PostContainer className="mb-2">
      <Header className="mb-2">
        <Link
          to={
            post!.user._id === user!._id
              ? "/profile"
              : `/users/${post!.user._id}`
          }
        >
          <RoundImage src={post!.user.profile_photo} />
        </Link>
        <FlexContainer>
          <div>
            <h4 className="mb-0">
              {post!.user.display_name ||
                post!.user.first_name + " " + post!.user.last_name}
            </h4>
            <p style={{ fontSize: "13px" }} className="mb-0 text-muted">
              {moment(post!.createdAt).fromNow()}
            </p>
          </div>
          {user!._id === post!.user._id && (
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
            dangerouslySetInnerHTML={{ __html: post!.content }}
          ></p>
          {/**@ts-ignore */}
          {post!.image && post!.image.url && (
            <img
              className="mb-2"
              width="100%"
              src={post!.image.url}
              alt="edit"
            />
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
              onChange={(e) =>
                e.target.files?.length ? setFile(e.target.files[0]) : null
              }
              type="file"
              name="image"
            />
            <em>Max 5MB (Accepted formats: jpg, jpeg, png)</em>
          </FormGroup>
          <FormGroup className="d-flex align-items-center">
            <button className="ml-auto mr-2 primary-button" type="submit">
              Edit
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={() => setEdit(false)}
            >
              Cancel
            </button>
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
                // @ts-ignore
                title={<em></em>}
                size={12}
                fill="white"
              />
            </RoundWrapper>
            <p style={{ fontSize: "14px" }} className="mb-0">
              {post!.likes.length}
            </p>
          </ClickDiv>
          <ClickDiv onClick={() => setCommentsDropdown(!commentsDropdown)}>
            <p className="mb-0">{comments.length} Comments</p>
          </ClickDiv>
        </TopFooter>
        <hr className="my-1" />
        <BottomFooter>
          <FooterItem onClick={() => likePost()}>
            {!post!.likes.some((e) => e._id === user!._id) ? (
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
                // @ts-ignore ????
                key={comment._id}
                comment={comment}
              />
            ))}
          <CommentForm post_id={post._id} />
        </CommentsContainer>
      )}

      {/* Likes Modal (absolutely positioned) */}
      <CSSTransition
        in={likesModal}
        timeout={300}
        classNames="fade"
        unmountOnExit
      >
        <LikesModal setLikesModal={setLikesModal} likes={post!.likes} />
      </CSSTransition>
    </PostContainer>
  );
};

export default Post;
