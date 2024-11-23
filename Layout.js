import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Use Link for navigation
import './Layout.css'; // Add any custom styling if necessary

const Layout = ({ children }) => {
  return (
    <div>
      {/* Navigation Bar */}
      <Navbar bg="light" expand="lg" className="navbar-custom">
        <Container>
          {/* Logo and Title */}
          <Navbar.Brand href="/" className="brand-logo">
            <img
              src="//www.alpha-grep.com/wp-content/uploads/2022/01/logo-color.png"
              alt="AlphaGrep"
              title="AlphaGrep"
              width="200"
              height="48"
              className="logo"
            />
          </Navbar.Brand>

          <Nav className="ml-auto">
            <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
            <Nav.Link href="#services">Services</Nav.Link>
            <Nav.Link href="#about">About</Nav.Link>
            <Nav.Link href="#contact">Contact</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <div className="layout-content">
        {children}
      </div>
    </div>
  );
};

export default Layout;
