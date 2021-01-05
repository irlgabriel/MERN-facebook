import moment from "moment";
import { useState, useEffect } from "react";
import {
  CommentContainer,
  UserPhoto,
  CommentBody,
  CommentWrapper,
  CommentFooter,
  FooterLink,
  LikesContainer,
  ReplyCount,
} from "./Comment.components";
import { Form, Input, Button, FormGroup } from "reactstrap";
import { Reply } from "..";
import { AiFillLike } from "react-icons/ai";
import { BsArrow90DegDown } from "react-icons/bs";
import { ReplyForm } from "..";
import axios from "axios";
import { Link } from "react-router-dom";

const Comment = ({ level = 0, comments, comment, setComments, user, post }) => {

  const [file, setFile] = useState(post.image);
  const [showReplyForm, setShowReply] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const [content, setContent] = useState(comment.content);
  const [showEdit, setEdit] = useState(false);

  const config = localStorage.getItem('token') &&  {
    headers: {
      Authorization: "bearer " + localStorage.getItem("token"),
    },
  };


  const deleteHandler = () => {
    window.confirm(
      "Are you sure you want to delete this comment? This action cannot be undone."
    ) &&
      axios
        .delete(`/posts/${post._id}/comments/${comment._id}`, config)
        .then((res) => {
          console.log(res.data._id, comment._id);
          setComments(
            comments.filter((comment) => comment._id !== res.data._id)
          );
        })
        .catch((err) => console.log(err));
  };

  const likeComment = () => {
    axios
      .post(`/posts/${post._id}/comments/${comment._id}`, {}, config)
      .then((res) => {
        setComments(
          comments.map((comment) =>
            comment._id === res.data._id ? res.data : comment
          )
        );
      })
      .catch((err) => console.log(err));
  };

  const editHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('content', content);
    if(file) formData.append('image', file);
    axios
      .put(`/posts/${post._id}/comments/${comment._id}`, formData, config)
      .then((res) => {
        setComments(
          comments.map((comment) =>
            comment._id === res.data._id ? res.data : comment
          )
        );
        setEdit(false);
      })
      .catch((err) => console.log(err));
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
    if (comments && comment) {
      setReplies(
        comments.filter(
          (comm) =>
            /*comm.hasOwnProperty("comment")*/ comm.comment && comm.comment._id === comment._id
        )
      );
    }
  }, []);

  useEffect(() => {
    const textarea = document.querySelector("textarea");
    if (textarea) {
      onChangeHandler(textarea);
    }
  }, [showEdit]);

  return (
    <CommentContainer>
      <Link
        to={
          user._id === comment.user._id
            ? "/profile"
            : `/users/${comment.user._id}`
        }
      >
        <UserPhoto className="mr-2" src={comment.user.profile_photo} />
      </Link>
      <CommentWrapper className={"w-100"}>
        <CommentBody>
          <h6 className="mb-0">
            {comment.user.display_name ||
              comment.user.first_name + " " + comment.user.last_name}
          </h6>
          {!showEdit ? (
            <div>
              <p
                className="mb-0"
                dangerouslySetInnerHTML={{ __html: comment.content }}
              ></p>
              {comment.image && (
                <Link to="/profile">
                  <img width="100%" src={comment.image.url} />
                </Link>
              )}
            </div>
          ) : (
            <Form onSubmit={(e) => editHandler(e)} className="w-100">
              <FormGroup>
                <Input
                  type="textarea"
                  placeholder="Content..."
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    onChangeHandler(e.target);
                  }}
                />
              </FormGroup>
              <FormGroup style={{ marginLeft: "12px" }}>
                <Input
                  onChange={(e) => setFile(e.target.files[0])}
                  type="file"
                  name="image"
                />
                <em>Max 5MB (Accepted formats: jpg, jpeg, png)</em>
              </FormGroup>
              <FormGroup className="text-right mb-1">
                <Button color="primary" type="submit" size="sm">
                  Edit
                </Button>
                <Button onClick={() => setEdit(false)} type='button' size='sm' className='ml-2' color='danger'>Cancel</Button>
              </FormGroup>
              
            </Form>
          )}
          {!showEdit && (
            <LikesContainer>
              <AiFillLike
                fill={
                  comment.likes.some((e) => e._id === user._id)
                    ? "royalblue"
                    : ""
                }
                size={12}
              />
              &nbsp;
              <p style={{ fontSize: "12px" }} className="d-inline-block mb-0">
                {comment.likes.length}
              </p>
            </LikesContainer>
          )}
        </CommentBody>
        <CommentFooter>
          <FooterLink
            color={
              comment.likes.some((e) => e._id === user._id)
                ? "royalblue"
                : "black"
            }
            onClick={() => likeComment()}
            bold
          >
            Like
          </FooterLink>
          {level < 3 && (
            <FooterLink bold onClick={() => setShowReply(!showReplyForm)}>
              Reply
            </FooterLink>
          )}
          {user._id === comment.user._id && (
            <FooterLink bold onClick={() => deleteHandler()} color="gray">
              <span style={{ color: "black" }}>&middot;&nbsp;&nbsp;</span>
              Delete
            </FooterLink>
          )}
          {user._id === comment.user._id && (
            <FooterLink bold onClick={() => setEdit(!showEdit)} color="gray">
              Edit
            </FooterLink>
          )}
          <FooterLink color="lightgray">
            {moment(comment.createdAt).fromNow()}
          </FooterLink>
        </CommentFooter>
        {replies.length && !showReplies ? (
          <div
            onClick={() => setShowReplies(true)}
            className="pl-3 pt-2 d-flex align-items-center"
          >
            <BsArrow90DegDown
              size={24}
              fill="black"
              style={{ transform: "rotate(-90deg)" }}
            />
            &nbsp;
            <ReplyCount className="mb-0 font-weight-bold">
              {replies.length} Replies
            </ReplyCount>
          </div>
        ) : (
          ""
        )}
        {showReplies &&
          replies.map((reply) => (
            <Reply
              key={reply._id}
              reply={reply}
              user={user}
              setReplies={setReplies}
              replies={replies}
              comment={comment}
              post={post}
            />
          ))}
        {showReplyForm && (
          <ReplyForm
            key={comment._id}
            user={user}
            post={post}
            comment={comment}
            replies={replies}
            setReplies={setReplies}
            setShowReply={setShowReply}
            setComments={setComments}
          />
        )}
      </CommentWrapper>
    </CommentContainer>
  );
};

export default Comment;
