import styled from "styled-components";
import { MdClose } from "react-icons/md";
export const Container = styled.div`
  margin-top: 24px;
  margin-bottom: 16px;
  padding: 12px 16px 10px 16px;
  border-radius: max(0px, min(8px, calc((100vw - 4px - 100%) * 9999))) / 8px;
  background: white;
  box-shadow: "0 2px 4px rgba(0, 0, 0, .1), 0 8px 16px rgba(0, 0, 0, .1)";

  textarea {
    ::-webkit-input-placeholder {
      line-height: 32px;
    }
    height: 32px !important;
    border-color: transparent;
    transition: border 0.2s ease-in-out;
  }

  textarea:focus {
    ::-webkit-input-placeholder {
      line-height: inherit;
    }
    padding: 4px 0;
    border: 1px solid;
    border-color: darkgrey !important;
    outline: none;
  }
`;

export const RoundImage = styled.div`
  border-radius: 20px;
  width: 36px;
  height: 36px;
  background-image: ${({ src }) => `url(${src})`};
  background-repeat: no-repeat;
  background-size: cover;
  z-index: 2;
`;
export const GrayHover = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  margin: 0 auto;
  &:hover {
    background: lightgray;
    border-radius: 6px;
    cursor: pointer;
  }
`;

export const CloseIcon = styled(MdClose)`
  position: absolute;
  top: 20px;
  right: 20px;
  color: gray;
  cursor: pointer;
  transition: transform 0.1s ease-in-out;

  width: 40px;
  height: 40px;

  :hover {
    transform: scale(1.2);
    color: black;
  }
`;

export const Image = styled.img`
  box-shadow: rgb(125 115 120) 0px 0px 44px 3px;
  max-width: 100%;
`;

export const ImageWrapper = styled.div`
  margin: 0 auto;
  position: relative;
  padding: 10px 0;
  display: flex;
  justify-content: center;
  max-width: 80%;
`;
