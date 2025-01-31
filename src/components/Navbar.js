import { Navbar, Container, Button, Image } from "react-bootstrap";
import { FiLogOut } from "react-icons/fi"; // Logout icon

function AppNavbar({ onLogout }) {
  return (
    <Navbar bg="dark" variant="dark" className="py-3 shadow-sm">
      <Container>
        <Navbar.Brand className="d-flex align-items-center">
          <Image src="/icon.svg" alt="AOBG" height={40} className="me-2" />
          AOBG Internal Tools
        </Navbar.Brand>
        <Button variant="outline-light" onClick={onLogout} className="d-flex align-items-center">
          <FiLogOut size={20} className="me-2" /> Logout
        </Button>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
