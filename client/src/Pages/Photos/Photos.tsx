import React from "react";
import { Photo } from "../../Components";
import { PhotosContainer } from "./Photos.components";
import { Photo as IPhoto } from "Types";

interface Props {
  photos: IPhoto[];
}

const Photos = ({ photos }: Props) => {
  return (
    <PhotosContainer>
      {!photos.length && <p>No photos Available</p>}
      {photos.map((photo) => (
        <Photo key={photo.id} photo={photo}></Photo>
      ))}
    </PhotosContainer>
  );
};

export default Photos;
