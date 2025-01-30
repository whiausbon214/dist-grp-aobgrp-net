import { Navbar, Container, Button } from "react-bootstrap";
import { FiLogOut } from "react-icons/fi"; // Logout icon

function AppNavbar({ onLogout }) {
  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand>AOBG Email Distribution Group Manager</Navbar.Brand>
        <Button variant="outline-light" onClick={onLogout}>
          <FiLogOut size={20} /> Logout
        </Button>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
