import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { FiMail, FiCloud, FiHome } from 'react-icons/fi';
import { SiMailchimp } from 'react-icons/si';
import './Navbar.css'; // Custom CSS for navbar

function AppNavbar() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand href="/" className="d-flex align-items-center">
          <img src="/logo.svg" alt="Logo" className="logo me-2" />
          AOBG Internal Tools
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/" className="d-flex align-items-center">
              <FiHome size={20} className="me-2" /> Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/distribution-groups" className="d-flex align-items-center">
              <FiMail size={20} className="me-2" /> Dist Groups
            </Nav.Link>
            <Nav.Link as={NavLink} to="/mailing-list" className="d-flex align-items-center">
              <SiMailchimp size={20} className="me-2" /> Mailing List
            </Nav.Link>
            <Nav.Link as={NavLink} to="/cloud-status" className="d-flex align-items-center">
              <FiCloud size={20} className="me-2" /> Cloud Status
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
