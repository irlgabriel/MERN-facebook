import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Overlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,120,.2);
  z-index: 211212121;
`

export const Container = styled.div`
  min-height: 300px;
  max-height: 70vh;
  min-width: 300px;
  max-width: 70%;
  border-radius: 6px;
  background: white;
  z-index: 6;
`

export const Header = styled.div`
  width: 100%;
  display: grid;
  place-items: center;
  border-bottom: 1px solid black;
  padding: .5rem;
  margin-bottom: 10px;
`

export const Like = styled(Link)`
  display: flex;
  color: black;
  margin-bottom: .5rem;
  &:hover {
    text-decoration: none;
    color: black;
  }
  p {
    width: 90%;
  }
  padding: 0 .5rem;
`

export const Image = styled.img`
  border-radius: 12px;
  margin-right: .5rem;
`

export const Paragraph = styled.p`
  margin-bottom: 0px;
`