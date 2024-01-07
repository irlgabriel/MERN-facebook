import Axios from "axios";
import React, { useState } from "react";
import { Button, FileInput } from "flowbite-react";

const ImageForm = ({ method = "PUT", content, path, setImageForm }) => {
  const [file, setFile] = useState<File | null>(null);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    e.stopPropagation(); // stop propagating submit the the comment form
    const formData = new FormData();
    if (content) formData.append("content", content);
    //@ts-ignore
    formData.append("image", file);
    if (method === "PUT") {
      Axios.put(path, formData)
        .then((res) => {
          setImageForm(false);
        })
        .catch((err) => console.log(err));
    } else {
      Axios.post(path, formData).then((res) => {
        setImageForm(false);
      });
    }
  };

  return (
    <div className="flex justify-center items-center fixed top-0 left-0 right-0 bottom-0 z-50 bg-slate-400 opacity-45">
      <form
        onSubmit={(e) => onSubmitHandler(e)}
        style={{ background: "white", borderRadius: "10px" }}
        className="p-3 w-50 mx-auto border border-slate-100"
      >
        <FileInput
          onChange={(e) => setFile(e.target?.files?.[0] ?? null)}
          name="image"
        />
        <Button className="mr-2" type="submit" color="secondary">
          Submit
        </Button>
        <Button
          type="button"
          color="danger"
          onClick={() => setImageForm(false)}
        >
          Cancel
        </Button>
      </form>
    </div>
  );
};

export default ImageForm;
