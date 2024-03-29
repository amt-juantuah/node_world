import { DarkModeOutlined } from '@mui/icons-material';
import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../Theme';
import { FcDocument, FcFilingCabinet } from 'react-icons/fc';
import { UserContext } from '../AuthContext';

const Container = styled.div`
    width: 100vw;
    height: 80px;
    display: flex;
    padding-left: 80px;
    padding-right: 80px;
    flex-flow: row;
    justify-content: space-between;
    align-items: center;
    background-color: var(--color-elements);
    position: sticky;
    top: 0;
    z-index: 2;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.19);
    & a {
      display: content;
      text-decoration: none;
    }
    @media screen and (max-width: 680px) {
      padding-left: 28px;
      padding-right: 28px;
    }
`;
const Div = styled.div`
    display: contents;
    width: 130px;
`;

const Title = styled.h2`
  @media screen and (max-width: 680px) {
    font-size: 14px;
    line-height: 12px;
  }
`;

const Span = styled.span`
  @media screen and (max-width: 680px) {
      font-size: 12px;
    }
`;

const Mode = styled.p`
  width: 100px;
  cursor: pointer;
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
  color: hsl(0, 0%, 100%);
  opacity: 0.6;
  & svg {
    fill: var(--color-text);
    @media screen and (max-width: 680px) {
      font-size: 11px;
      line-hight: 16px;
    }
  };
  & ${Span} {
    color: var(--color-text);
    font-weight: 600;
    @media screen and (max-width: 680px) {
      font-size: 12px;
      line-hight: 16px;
    }
  }
  &:hover {
    opacity: 1;
  }
  @media screen and (max-width: 680px) {
    width: 85px;
  }
`;

const AuthDiv = styled.div`
    display: flex;
    transition: all 400ms;
    flex-flow: row;
    align-items: center;
    justify-content: space-around;
    height: auto;
    width: auto;
    border: 1px solid #04a7c4;
    border-radius: 5px;
    padding: 4px;
    gap: 4px;
    @media screen and (max-width: 680px) {
      border-radius: 2px;
      padding: 2px;
      gap: 2px;
    }
`;

const Button = styled.button`
    border-radius: 5px;
    background: #04a7c46c;
    height: 30px;
    width: 75px;
    font-size: 14px;
    border: 1px solid #04a7c4;
    cursor: pointer;
    &:hover {
        background-color: red;
        color: #fbcece;
    };
    @media screen and (max-width: 680px) {
      width: 45px;
      height: 25px;
      border-radius: 2px;
      font-size: 11px;
    }
`;

const UserSpan = styled.span`
  margin-left: 20px;
  font-size: 12px !important;
`;


const Navbar:React.FC = () => {
  const {theme, themeToggler} = useContext(ThemeContext);
  const { user, logout } = useContext(UserContext);

  return (
    <Container>
        <Link to="/">
          <Div>
              { user && user.isadmin ?
                <Title style={{color: "red"}}>Documents Hub Administrator</Title>
                : <Title>Documents Hub</Title>
              }
            <Title><FcDocument /><FcFilingCabinet/></Title>
          </Div>
        </Link>

        { user && user.id ?
          <AuthDiv>
              <Button onClick={logout}>Logout</Button>       
          </AuthDiv>
          :
          <AuthDiv>
              <Link to="/login"><Button>Login</Button> </Link>
              <Link to="/register"><Button>Register</Button> </Link>        
          </AuthDiv>
        }
        <Mode onClick={themeToggler}>
          <DarkModeOutlined />
          <Span>{theme === "light" ? 'Dark Mode' : 'Light Mode'}</Span>
        </Mode>
    </Container>
  )
}

export default Navbar;