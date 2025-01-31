import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { FiMail, FiCloud, FiHome } from 'react-icons/fi';
import { SiMailchimp } from 'react-icons/si';
import './Navbar.css'; // Custom CSS for sidebar

function AppNavbar() {
  return (
    <Navbar bg="dark" variant="dark" className="flex-column sidebar">
      <Navbar.Brand href="/" className="text-center">
        <img src="/logo.svg" alt="Logo" className="logo" />
        AOBG Internal Tools
      </Navbar.Brand>
      <Nav className="flex-column mt-4">
        <Nav.Link as={NavLink} to="/" className="d-flex align-items-center">
          <FiHome size={20} className="mr-2" /> Home
        </Nav.Link>
        <Nav.Link as={NavLink} to="/distribution-groups" className="d-flex align-items-center">
          <FiMail size={20} className="mr-2" /> Dist Groups
        </Nav.Link>
        <Nav.Link as={NavLink} to="/mailing-list" className="d-flex align-items-center">
          <SiMailchimp size={20} className="mr-2" /> Mailing List
        </Nav.Link>
        <Nav.Link as={NavLink} to="/cloud-status" className="d-flex align-items-center">
          <FiCloud size={20} className="mr-2" /> Cloud Status
        </Nav.Link>
      </Nav>
    </Navbar>
  );
}

export default AppNavbar;
