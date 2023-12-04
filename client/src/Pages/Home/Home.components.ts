import styled from "styled-components";
import { Link } from "react-router-dom";
import { Col } from "reactstrap";

export const RoundImage = styled.div<{ src: string }>`
  border-radius: 20px;
  width: 36px;
  height: 36px;
  background-image: ${({ src }) => `url(${src})`};
  background-repeat: no-repeat;
  background-size: cover;
`;

export const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 6px;
  color: black;
  font-size: 18px;
  transition: all 0.2s ease-in-out;
  &:hover {
    cursor: pointer;
    color: black;
    background: lightgray;
    text-decoration: none;
  }
`;

export const NoPostsDiv = styled.div`
  padding: 0.5rem;
  width: 100%;
  border-radius: 5px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const FakeLink = styled.div`
  display: inline-block;
  color: royalblue;
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

export const Column = styled(Col)`
  overflow-y: scroll;
  max-height: 90vh;
`;
