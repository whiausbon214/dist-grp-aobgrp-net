import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { FiMail, FiCloud, FiHome } from 'react-icons/fi';
import { SiMailchimp } from 'react-icons/si';

function AppNavbar() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand href="/">AOBG Internal Tools</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={NavLink} to="/">
            <FiHome size={20} /> Home
          </Nav.Link>
          <Nav.Link as={NavLink} to="/distribution-groups">
            <FiMail size={20} /> Dist Groups
          </Nav.Link>
          <Nav.Link as={NavLink} to="/mailing-list">
            <SiMailchimp size={20} /> Mailing List
          </Nav.Link>
          <Nav.Link as={NavLink} to="/cloud-status">
            <FiCloud size={20} /> Cloud Status
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default AppNavbar;
