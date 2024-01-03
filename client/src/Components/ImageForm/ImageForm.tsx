import Axios from "axios";
import React, { useState } from "react";
import { GrDiamond } from "react-icons/gr";
import { Container, Form, Input, Button, FormGroup } from "reactstrap";
import { TransparentBackground } from "./ImageForm.components";

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
    <TransparentBackground className="d-flex justify-content-center align-items-center">
      <Form
        onSubmit={(e) => onSubmitHandler(e)}
        style={{ background: "white", borderRadius: "10px" }}
        className="p-3 w-50 mx-auto"
        border
      >
        <FormGroup className="text-center">
          <Input
            onChange={(e) => setFile(e.target?.files?.[0] ?? null)}
            type="file"
            name="image"
          />
        </FormGroup>
        <FormGroup className="d-flex justify-content-end">
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
        </FormGroup>
      </Form>
    </TransparentBackground>
  );
};

export default ImageForm;
