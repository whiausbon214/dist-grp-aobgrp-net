import { Navbar, Container, Button, Image, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { FiLogOut, FiMail, FiCloud, FiHome } from "react-icons/fi";
import { SiMailchimp } from "react-icons/si";

function AppNavbar({ onLogout }) {
  return (
    <Navbar bg="dark" variant="dark" className="py-3 shadow-sm">
      <Container>
        <Navbar.Brand className="d-flex align-items-center">
          <Image src="/icon.svg" alt="AOBG" height={40} className="me-2" />
          AOBG Internal Tools
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={NavLink} to="/" exact className="d-flex flex-column align-items-center" activeClassName="active">
            <FiHome size={20} />
            <span>Home</span>
          </Nav.Link>
          <Nav.Link as={NavLink} to="/distribution-groups" className="d-flex flex-column align-items-center" activeClassName="active">
            <FiMail size={20} />
            <span>Dist Groups</span>
          </Nav.Link>
          <Nav.Link as={NavLink} to="/mailing-list" className="d-flex flex-column align-items-center" activeClassName="active">
            <SiMailchimp size={20} />
            <span>Mailing List</span>
          </Nav.Link>
          <Nav.Link as={NavLink} to="/cloud-status" className="d-flex flex-column align-items-center" activeClassName="active">
            <FiCloud size={20} />
            <span>Cloud Status</span>
          </Nav.Link>
        </Nav>
        <Button variant="outline-light" onClick={onLogout} className="d-flex align-items-center">
          <FiLogOut size={20} className="me-2" /> Logout
        </Button>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
