import styled from "styled-components";

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
