import Axios from "axios";
import React, { useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import Link from "next/link";
import { BsFillImageFill } from "react-icons/bs";
import { Button, FileInput, Textarea } from "flowbite-react";
import useOutsideClick from "../../hooks/utils";

const CommentForm = ({ post, user, comments }) => {
  const submitButtonArea = useRef<HTMLFormElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [imageForm, setImageForm] = useState(false);
  const [content, setContent] = useState("");
  const [showSubmit, setSubmit] = useState(false);

  useOutsideClick([submitButtonArea], () => {
    setSubmit(false);
  });

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("content", content);
    if (file) formData.append("image", file);
    Axios.post(`/posts/${post._id}/comments`, formData, {
      headers: {
        Authorization:
          "bearer " + typeof window !== undefined
            ? localStorage.getItem("token")
            : "",
      },
    })
      .then((res) => {
        setContent("");
        setImageForm(false);
        setFile(null);
        // setComments([res.data, ...comments]);
      })
      .catch((err) => console.log(err));
  };

  const onChangeHandler = (e) => {
    // Reset field height
    e.target.style.height = "inherit";

    // Calculate the height
    const height = e.target.scrollHeight;

    e.target.style.height = `${height}px`;
  };

  return (
    <form ref={submitButtonArea} onSubmit={(e) => submitHandler(e)}>
      <div className="flex items-center mb-2">
        <Link className="mr-2" href="/profile">
          <img className="w-8 h-8 rounded-2xl" src={user.profile_photo} />
        </Link>
        <section className="mb-0 w-full relative">
          <Textarea
            onFocus={() => setSubmit(true)}
            style={{ borderRadius: "16px" }}
            value={content}
            className="w-full h-8 py-1 pr-5"
            placeholder="Write a comment.."
            rows={1}
            name="content"
            onChange={(e) => {
              setContent(e.target.value);
              onChangeHandler(e);
            }}
          />
          <BsFillImageFill
            className="absolute cursor-pointer mr-2 right-3 top-1 transition duration-300 ease-in-out hover:scale-110"
            onClick={() => setImageForm(!imageForm)}
            size={24}
            fill="green"
          />
        </section>
      </div>
      <CSSTransition in={imageForm} timeout={0} classNames="fade" unmountOnExit>
        <section className="ml-10">
          <FileInput
            onChange={(e) => setFile(e.target?.files?.[0] ?? null)}
            name="image"
          />
          <em className="text-xs text-slate-400">
            Max 5MB (Accepted formats: jpg, jpeg, png)
          </em>
        </section>
      </CSSTransition>
      {showSubmit && (
        <section className="text-right">
          <Button
            className="ml-auto select-none"
            gradientDuoTone="cyanToBlue"
            outline
            type="submit"
            size="xs"
          >
            Comment!
          </Button>
        </section>
      )}
    </form>
  );
};

export default CommentForm;
