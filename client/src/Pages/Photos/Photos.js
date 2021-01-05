
import { Photo } from '../../Components';
import {
  PhotosContainer,
} from "./Photos.components";

const Photos = ({ photos }) => {

  return (
    <PhotosContainer>
      {
        !photos.length && 
        <p>No photos Available</p>
      }
      {photos.map(photo => 
        <Photo key={photo._id} photo={photo}></Photo>
      )}
    </PhotosContainer>
)
}

export default Photos;