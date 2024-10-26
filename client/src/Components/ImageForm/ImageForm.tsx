import Axios from "axios";
import React, { useState } from "react";
import { Button, FileInput } from "flowbite-react";
import { Dialog } from "@headlessui/react";

const ImageForm = ({ method = "PUT", content, path, setImageForm }) => {
  const [file, setFile] = useState<File | null>(null);

  const onSubmitHandler: React.FormEventHandler<HTMLFormElement> = (e) => {
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

  const onClose = () => {
    setImageForm(false);
  };

  return (
    <Dialog className="relative z-50" onClose={onClose} open={true}>
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded bg-white">
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
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ImageForm;
