import React from 'react';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';

const NavbarComponent = ({ theme, toggleTheme }) => {
  return (
    <Navbar bg={theme} variant={theme} expand="lg" className='fixed-top'>
      <Container>
        <Navbar.Brand href="#home">
          <img
            src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="React Bootstrap logo"
          />
        </Navbar.Brand>
        <Nav className="ms-auto">
          <Button variant={theme === 'light' ? 'dark' : 'light'} onClick={toggleTheme} className="d-flex align-items-center">
            {theme === 'light' ? <MoonOutlined className="me-2" /> : <SunOutlined className="me-2" />}
          </Button>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
